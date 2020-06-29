import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    loadFormulaItem,
    changeFormula,
    updateFormula,
    addNewFormula,
    deleteRawItem
} from "redux/actions/formulaAction";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import AddIcon from '@material-ui/icons/Add';
import CircularIndeterminate from "components/Loader/Loader";
import {loadProduct} from "redux/actions/productAction";
import { useConfirm } from "material-ui-confirm";
import FormulaRawItem from "../components/FormulaRawItem";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import {loadRaws} from "redux/actions/rawAction";
import {useDialog} from "components/SelectDialog";
import {IRawInFormula} from "../../../types/model/formula";

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
    const formulaId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;

    const formulaItem  = useSelector((state: any)=> state.formula.formulaItem);
    const selectDialog = useDialog();
    const isLoading = useSelector((state: any) => state.formula.isLoading);
    // const errorValue = useSelector((state: any) => state.formula.error);
    const hasError = useSelector((state: any) => state.formula.hasError);
    const productItems = useSelector((state: any) => state.product.products);
    const rawItems = useSelector((state: any) => state.raw.raws)

    /**
     * Изменения основных компонентов
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...formulaItem, [event.target.name]: event.target.value};
        dispatch(changeFormula(item))
    };

    /**
     * Сменить продукцию, на которую производится расчёт
     */
    const handleChangeProduct = () => {
        dispatch(loadProduct());
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
                const index = item.raws.findIndex((item:IRawInFormula, index:number, array: IRawInFormula[]) => {return item.id === id});
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
                'title': 'Подтверждение',
                description: `Удалить выбранную запись?.`,
                confirmationText:'Да',
                cancellationText: 'Нет'
            }
            ).then(() =>
            dispatch(deleteRawItem(id))
        )
    };

    /**
     * Добавление нового сырья в рецептуру
     */
    const handleAddNewRawItem = () => {
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
                const itemRaw: IRawInFormula = {id: 0, raw_value: 0, raw: {id: value.id, name: value.name}};
                item.raws.push(itemRaw);
                dispatch(changeFormula(item));
            }
        )
    };

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        if (formulaId === 0) {
            dispatch(addNewFormula(formulaItem));
        } else {
            dispatch(updateFormula(formulaItem));
        }
        if (!hasError) history.push('/catalogs/formula');
    };

    useEffect(()=>{
        dispatch(loadRaws());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=> {
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
                                <Paper component="form" elevation={0} className={classes.paper_root}>
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

                            <Grid item xs={11}>
                                <Typography variant={"h5"}>
                                    Список сырья в рецептуре
                                </Typography>
                            </Grid>
                            <Grid item xs={1} >
                                <Fab color="default" aria-label="add" onClick={(event) => {handleAddNewRawItem()}}>
                                    <AddIcon />
                                </Fab>
                            </Grid>

                            {formulaItem.raws.map((rawItem: any) =>(
                                <FormulaRawItem
                                    item={rawItem}
                                    onChangeItem={handleChangeRawItem}
                                    onDeleteItem={handleDeleteRawItem}/>
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
