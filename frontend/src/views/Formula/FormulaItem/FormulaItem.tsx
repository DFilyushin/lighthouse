import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField,
    Tooltip,
    Paper,
    Fab,
    Typography,
    IconButton
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    loadFormulaItem,
    changeFormula,
    updateFormula,
    addNewFormula,
    deleteRawItem,
    addNewRawItem
} from "redux/actions/formulaAction";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import AddIcon from '@material-ui/icons/Add';
import OpacityIcon from '@material-ui/icons/Opacity';
import CircularIndeterminate from "components/Loader/Loader";
import {loadProduct} from "redux/actions/productAction";
import { useConfirm } from "material-ui-confirm";
import FormulaRawItem from "../components/FormulaRawItem";
import {loadRaws} from "redux/actions/rawAction";
import {useDialog} from "components/SelectDialog";
import {IRawInFormula} from "types/model/formula";
import {
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES,
    NEW_RECORD_VALUE
} from "utils/AppConst";
import {showInfoMessage} from "redux/actions/infoAction";

interface IFormulaItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const FormulaItem = (props: IFormulaItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const paramId = props.match.params.id;
    const formulaId = paramId === 'new' ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const formulaItem  = useSelector((state: any)=> state.formula.formulaItem);
    const selectDialog = useDialog();
    const isLoading = useSelector((state: any) => state.formula.isLoading);
    const productItems = useSelector((state: any) => state.product.products);
    const rawItems = useSelector((state: any) => state.raw.raws)
    const [hasProductError, setProductError] = useState(false)
    const [hasCountError, setCountError] = useState(false)
    const [hasNoItemsError, setNoItemError] = useState(false)

    /**
     * Изменения основных компонентов
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...formulaItem, [event.target.name]: event.target.value};
        dispatch(changeFormula(item))
    };

    /**
     * Сменить продукцию
     */
    const handleChangeProduct = () => {
        selectDialog(
            {
                'title': 'Выбор продукции',
                description: '.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: productItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...formulaItem};
                item.product.id = value.id;
                item.product.name = value.name;
                dispatch(changeFormula(item));
                setProductError(false)
            }
        );
    };


    /**
     * Выбор и изменение строки с сырьём
     * @param id
     */
    const handleChangeRawItem = (id: number)=>{
        selectDialog(
            {
                'title': 'Выбор сырья',
                description: '.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: rawItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...formulaItem};
                const index = item.raws.findIndex((item: IRawInFormula) => {return item.id === id})
                item.raws[index].raw.id = value.id;
                item.raws[index].raw.name = value.name;
                dispatch(changeFormula(item));
            }
        );
    };

    /**
     * Удаление сырья из списка
     * @param id
     */
    const handleDeleteRawItem = (id: number)=>{
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
            ).then(() =>
            dispatch(deleteRawItem(id))
        )
    };

    /**
     * Добавление нового сырья в рецептуру
     */
    const handleAddNewRawItem = () => {
        setNoItemError(false)
        dispatch(addNewRawItem())
    };

    /**
     * Калькуляция рецептуры
     */
    const handleCalculation = () => {
        const formula = {...formulaItem}
        const workItems = formula.raws.filter((item:IRawInFormula) => item.substance !== 0)
        if (workItems.length === formula.raws.length) {
            dispatch(showInfoMessage('info', 'Нечего считать!'))
            return
        }
        if (formulaItem.raws.length - workItems.length > 1) {
            dispatch(showInfoMessage('info', 'Слишком много неизвестных!'))
            return;
        }
        formula.raws = formula.raws.map((item: IRawInFormula) => {
            if (item.substance !== 0){
                item.raw_value = +(item.substance * 100 / item.concentration).toFixed(1)
            }
            return item
        })
        const components_substance = workItems.reduce((acc: number, curr: IRawInFormula) => acc + curr.substance * 100 / curr.concentration, 0);
        formula.raws = formula.raws.map((item: IRawInFormula) => {
            if (item.substance === 0) {
                item.raw_value = (formula.density * formula.calcAmount) - +components_substance.toFixed(1);
            }
            return item
        })
        dispatch(changeFormula(formula))
    };

    /**
     * Проверка корректности ввода
     */
    function isValid() {
        const hasProduct = formulaItem.product.id > 0
        const hasCalcAmount = formulaItem.calcAmount > 0
        const hasRawItems = formulaItem.raws.length > 0
        const hasIncorrectRawValues = formulaItem.raws.filter((item:IRawInFormula) => item.raw.id === 0).length === 0
        setProductError(!hasProduct)
        setCountError(!hasCalcAmount)
        setNoItemError(!hasRawItems || !hasIncorrectRawValues)
        return hasProduct && hasCalcAmount && hasRawItems && hasIncorrectRawValues
    }

    /**
     * Сохранение изменений
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try {
            if (formulaId === NEW_RECORD_VALUE) {
                await dispatch(addNewFormula(formulaItem));
            } else {
                await dispatch(updateFormula(formulaItem));
            }
            resolve();
        }catch (e) {
            console.log('reject')
            reject()
        }
    });

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        if (isValid()) {
            saveItem(dispatch).then(() => {
                    history.push('/catalogs/formula');
                }
            ).catch(() => {
                console.log('Error....')
            }).finally(
                () => {
                    console.log('saveHandler_end');
                }
            );
        }
        else{
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
        event.preventDefault();
    };

    useEffect(()=>{
        dispatch(loadRaws());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=> {
            dispatch(loadProduct());
            dispatch(loadFormulaItem(formulaId));
        }, [dispatch, formulaId]
    );

    const getCard = () => {
        return (
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader subheader="" title="Рецептура"/>
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={12}
                            >
                                <Paper elevation={0} className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        disabled={true}
                                        label="Рассчёт на продукт"
                                        margin="dense"
                                        name="unit"
                                        onChange={handleChange}
                                        required
                                        value={formulaItem.product.name}
                                        variant="outlined"
                                        helperText={hasProductError ? "Обязательное поле" : ""}
                                        error={hasProductError}
                                    />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeProduct}>
                                        <MenuOpenIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                            <Grid
                                item
                                xs={3}
                            >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="Рассчёт"
                                    margin="dense"
                                    name="calcAmount"
                                    onChange={handleChange}
                                    required
                                    value={formulaItem.calcAmount}
                                    variant="outlined"
                                    helperText={hasCountError ? "Подозрительное значение" : ""}
                                    error={hasCountError}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                            >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="% потерь"
                                    margin="dense"
                                    name="calcLosses"
                                    onChange={handleChange}
                                    required
                                    value={formulaItem.calcLosses}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                            >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="Плотность, г/см3"
                                    margin="dense"
                                    name="density"
                                    onChange={handleChange}
                                    required
                                    value={formulaItem.density}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Спецификация"
                                    margin="dense"
                                    name="specification"
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    value={formulaItem.specification}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={10}>
                                <Typography variant={"h5"}>
                                    Список сырья в рецептуре
                                </Typography>
                            </Grid>
                            <Grid item xs={1} >
                                <Fab color="default" aria-label="add" onClick={(event) => {handleCalculation()}}>
                                    <Tooltip title={'Калькуляция'}>
                                        <OpacityIcon />
                                    </Tooltip>
                                </Fab>
                            </Grid>

                            <Grid item xs={1} >
                                <Fab color="default" aria-label="add" onClick={(event) => {handleAddNewRawItem()}}>
                                    <Tooltip title={'Добавить новое сырьё'}>
                                        <AddIcon />
                                    </Tooltip>
                                </Fab>
                            </Grid>
                            {hasNoItemsError &&
                                <Grid item xs={12}>
                                    <Typography color={"error"}>
                                        Рецептура должна содержать сырьё...
                                    </Typography>
                                </Grid>
                            }
                            {formulaItem.raws.map((rawItem: any, index: number) =>(
                                <FormulaRawItem
                                    key={index}
                                    item={rawItem}
                                    onChangeItem={handleChangeRawItem}
                                    onDeleteItem={handleDeleteRawItem}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            type={"submit"}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/catalogs/formula'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        )
    };

    return (
        <div className={classes.root}>
            {
                isLoading ? <CircularIndeterminate/>
                :
                getCard()
            }
        </div>
    );
};

export default FormulaItem;
