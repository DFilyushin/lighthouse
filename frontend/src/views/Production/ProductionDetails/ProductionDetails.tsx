import React, {ReactNode, SyntheticEvent, useEffect, useState} from 'react';
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
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import AddIcon from '@material-ui/icons/Add';
import CircularIndeterminate from "components/Loader/Loader";
import { useConfirm } from "material-ui-confirm";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import {useDialog} from "components/SelectDialog";
import {IStateInterface} from "redux/rootReducer";
import {
    getAutoCalculation,
    changeProductionCard,
    deleteCalcItem,
    deleteTareItem,
    deleteTeamItem,
    getProductionCalc,
    getProductionTare,
    getProductionTeam,
    loadProductionCard,
    newCalcItem,
    newTeamItem,
    updateCalcItem,
    updateProduction,
    updateTareItem,
    updateTeamItem,
    newTareItem, executeCard, sendCardToWork, cancelCard, addNewProduction
} from "redux/actions/productionAction";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LayersIcon from '@material-ui/icons/Layers';
import Tooltip from '@material-ui/core/Tooltip';
import {KeyboardDateTimePicker} from "@material-ui/pickers";
import ProductionTeamItem from "../components/ProductionTeamItem";
import ProductionCalcItem from "../components/ProductionCalcItem/ProductionCalcItem";
import {
    CARD_STATE_DRAFT,
    CARD_STATE_IN_WORK, CARD_STATE_READY,
    CardStateString,
    IProductionCalc,
    IProductionTare, IProductionTeam
} from "types/model/production";
import {loadRaws} from "redux/actions/rawAction";
import {loadProduct} from "redux/actions/productAction";
import {loadFactoryLines} from "redux/actions/factoryLineAction";
import ProductionTareItem from "../components/ProductionTareItem";
import ProductionStateIcon from '../components/ProductionStateIcon';
import TabPanel from "../components/TabPanel";
import {loadEmployeeList} from "redux/actions/employeeAction";
import {loadTare} from "redux/actions/tareAction";
import {ITare} from "types/model/tare";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { DateTimePicker } from "@material-ui/pickers";
import {
    DIALOG_ASK_DELETE,
    DIALOG_CANCEL_TEXT,
    DIALOG_NO,
    DIALOG_SELECT_TEXT,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES,
    NEW_RECORD_VALUE
} from "utils/AppConst";
import {showInfoMessage} from "redux/actions/infoAction";
import {loadFormulaReference} from "../../../redux/actions/formulaAction";

const PAGE_MAIN: number = 0;
const PAGE_CALC: number = 1;
const PAGE_TEAM: number = 2;
const PAGE_PRODUCT: number = 3;

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
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

interface IProductionDetailsProps {
    className: string,
    match: any
}

const ProductionDetails = (props: IProductionDetailsProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const selectDialog = useDialog();
    const { className, match } = props;
    const paramId = match.params.id;
    const idProduction = paramId === 'new' ? NEW_RECORD_VALUE :parseInt(paramId);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [tab, setTab] = React.useState(0);

    const productionItem = useSelector((state: IStateInterface)=> state.production.prodCardItem)
    const productionTeam = useSelector((state: IStateInterface)=> state.production.prodCardTeam)
    const productionCalc = useSelector((state: IStateInterface)=> state.production.prodCardCalc)
    const productionTare = useSelector((state: IStateInterface)=> state.production.prodCardTare)
    //const canRedirect = useSelector((state: IStateInterface)=> state.production.canRedirect);
    const isLoading = useSelector((state: IStateInterface) => state.production.isLoading)
    //const hasError = useSelector((state: IStateInterface) => state.production.hasError)
    const productItems = useSelector((state: IStateInterface) => state.product.products)
    const rawItems = useSelector((state: IStateInterface) => state.raw.raws)
    const tareItems = useSelector((state:IStateInterface) => state.tare.tareItems)
    const prodLinetItems = useSelector((state: IStateInterface) => state.factoryLine.items)
    const emplItems = useSelector((state: IStateInterface) => state.employee.items)
    const formulas = useSelector((state: IStateInterface) => state.formula.formulasForSelect)

    const [hasProductError, setProductError] = useState(false)
    const [hasFactoryLineError, setFactoryLineError] = useState(false)
    const [hasMasterError, setMasterError] = useState(false)
    const [hasCorrectValueError, setCorrectValueError] = useState(false)
    const [hasFormulaError, setFormulaError] = useState(false)

    /**
     * Изменения основных компонентов
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...productionItem, [event.target.name]: event.target.value};
        dispatch(changeProductionCard(item))
        if (event.target.name === 'calcValue') {setCorrectValueError(false)}
    };

    const cardMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    //TODO Реализовать в виде отдельного компонента
    /**
     * Сменить продукцию, на которую производится расчёт
     */
    const handleChangeProduct = () => {
        selectDialog(
            {
                'title': 'Выбор продукции',
                description: '.',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: productItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...productionItem}
                item.product.id = value.id
                item.product.name = value.name
                dispatch(changeProductionCard(item))
                dispatch(loadFormulaReference(value.name))
                setProductError(false)
            }
        );
    };

    const handleChangeFormula = () => {
        selectDialog(
            {
                'title': 'Выбор рецептуры расчёта продукции',
                description: '.',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: formulas,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...productionItem}
                item.formula.id = value.id
                item.formula.product.name = value.name
                item.idFormula = value.id
                dispatch(changeProductionCard(item))
                setFormulaError(false);
            }
        );
    }

    const handleChangeMaster = () => {
        selectDialog(
            {
                'title': 'Выбор начальника смены',
                description: '.',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: emplItems,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value:any) => {
                const item = {...productionItem};
                item.teamLeader.id = value.id;
                item.teamLeader.fio = value.name;
                dispatch(changeProductionCard(item));
                setMasterError(false)
            }
        );
    }

    /**
     * Добавить новую запись смены
     * @param id
     */
    const handleAddTeamItem = (id: number)=> {
        dispatch(newTeamItem())
    };

    /**
     * Добавить новую запись с готовой продукцией
     * @param id
     */
    function handleAddTareItem (id: number) {
        console.log('handleAddTareItem')
        dispatch(newTareItem())
    }

    /**
     * Добавить новую запись калькуляции
     * @param id
     */
    const handleAddCalcItem = (id: number)=> {
        dispatch(newCalcItem())
    };

    /**
     * Добавить автоматически рассчитанную калькуляцию
    */
    const handleAddCalcAuto = () => {
        if (productionCalc.length > 0) {
            confirm(
                {
                    'title': DIALOG_TYPE_CONFIRM,
                    description: `Добавление автоматической калькуляции удалит имеющиеся записи. Продолжить?.`,
                    confirmationText: DIALOG_YES,
                    cancellationText: DIALOG_NO
                }
            ).then(()=>{dispatch(getAutoCalculation())});
        }else{
            dispatch(getAutoCalculation())
        }

    };

    const handleChangeTeamItem = (id: number)=> {
        selectDialog(
            {
                'title': 'Выбор сотрудника',
                description: '.',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: emplItems,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value:any) => {
            const item = [...productionTeam];
            const index = item.findIndex((item:IProductionTeam, index:number, array: IProductionTeam[]) => {return item.id === id});
            item[index].employee.id = value.id;
            item[index].employee.fio = value.name;
            dispatch(updateTeamItem(item[index]));
            }
        );
    };

    /**
     * Удалить запись со сменой
     * @param id
     */
    const handleDeleteTeamItem = (id: number)=> {
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteTeamItem(id))
        );
    };

    const handleDeleteTareItem = (id: number)=> {
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteTareItem(id))
        );
    };

    /**
     * Изменение вкладки
     * @param event
     * @param newValue - Индекс новой вкладки
     */
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
        switch (newValue) {
            case PAGE_TEAM: if (productionTeam.length === 0) dispatch(getProductionTeam(idProduction)); break;
            case PAGE_CALC: if (productionCalc.length === 0) dispatch(getProductionCalc(idProduction));break;
            case PAGE_PRODUCT: if (productionTare.length === 0) dispatch(getProductionTare(idProduction));break;
        }
    };

    useEffect(()=>{
        dispatch(loadRaws());
        dispatch(loadProduct());
        dispatch(loadFactoryLines());
        dispatch(loadEmployeeList());
        dispatch(loadTare());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=> {
            dispatch(loadProductionCard(idProduction));
        }, [dispatch, idProduction]
    );

    function a11yProps(index: any) {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
        };
    }

    const handleDateChangeProdStart = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...productionItem, 'prodStart': strDate as string};
        dispatch(changeProductionCard(item))
    };

    const handleDateChangeProdFinish = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...productionItem, 'prodFinish': strDate as string};
        dispatch(changeProductionCard(item))
    };

    //TODO реализовать в виде отдельного компонента
    const handleChangeProdLine = () => {
        selectDialog(
            {
                'title': 'Выбор линии',
                description: '.',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: prodLinetItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...productionItem}
                item.prodLine.id = value.id
                item.prodLine.name = value.name
                dispatch(changeProductionCard(item))
                setFactoryLineError(false)
            }
        );
    };

    /**
     * Изменить сырьё для калькуляции
     * @param id Код записи
     */
    const handleChangeCalcItem = (id: number) => {
        selectDialog(
            {
                'title': 'Выбор сырья',
                description: '.',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: rawItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
            const item = [...productionCalc];
            const index = item.findIndex((item:IProductionCalc, index:number, array: IProductionCalc[]) => {return item.id === id});
            item[index].raw.id = value.id;
            item[index].raw.name = value.name;
            dispatch(updateCalcItem(item[index]));
            }
        );
    };

    /**
     * Удалить запись калькуляции
     * @param id
     */
    const handleDeleteCalcItem = (id: number) => {
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteCalcItem(id))
        );
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    //TODO Реализовать в виде отдельного компонента
    const handleChangeTareItem = (id: number)=> {
        selectDialog(
            {
                'title': 'Выбор тары',
                description: '.',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: tareItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const items = [...productionTare];
                const index = items.findIndex((item:IProductionTare, index:number, array: IProductionTare[]) => {return item.id === id});
                items[index].tareId = value.id;
                items[index].tareName = value.name;
                const tareIndex = tareItems.findIndex((elem: ITare, index: number, array: ITare[])=>{return elem.id === value.id});
                items[index].tareV = tareItems[tareIndex].v
                dispatch(updateTareItem(items[index]));
            }
        );
    };

    /**
     * Возможность редактирования карты
     */
    const canEditCard = ()=> {
        return ((productionItem.curState === CARD_STATE_DRAFT) || (productionItem.curState === CARD_STATE_IN_WORK))
    };

    /**
     * Проверка корректности ввода
     */
    function isValid() {
        const hasProduct = productionItem.product.id > 0
        const hasProductionLine = productionItem.prodLine.id > 0
        const hasMaster = productionItem.teamLeader.id > 0
        const hasCorrectValue = productionItem.calcValue > 0
        const hasFormulaValue = productionItem.formula.id > 0
        // const hasIncorrectRawValues = formulaItem.raws.filter((item:IRawInFormula) => item.raw.id === 0).length === 0
        setFormulaError(!hasFormulaValue)
        setProductError(!hasProduct)
        setFactoryLineError(!hasProductionLine)
        setMasterError(!hasMaster)
        setCorrectValueError(!hasCorrectValue)
        return hasProduct && hasProductionLine && hasCorrectValue && hasMaster && hasFormulaValue
    }


    const saveItem = (dispatch:any) => new Promise(async(resolve, reject) => {
        if (isValid()) {
            try {
                if (idProduction === NEW_RECORD_VALUE) {
                    await dispatch(addNewProduction(productionItem))
                } else {
                    await dispatch(updateProduction(productionItem));
                }
                resolve()
            } catch (e) {
                reject()
            }
        }else{
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
    });


    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        saveItem(dispatch).then(()=>{
            console.log('Main dataset save Ok');

        }).catch((e)=> {
            console.log('Error')
        });
        event.preventDefault();
    };

    function getCardState(state: number): string {
        return CardStateString[state]
    }

    //TODO Реализовать печать производственной карты
    function handleMenuPrint() {

    }

    function handleMenuCardToWork() {
        dispatch(sendCardToWork(productionItem.id));
        setAnchorEl(null);
    }

    function handleMenuCardExecute() {
        dispatch(executeCard(productionItem.id))
        setAnchorEl(null);
    }

    function handleMenuCardCancel() {
        dispatch(cancelCard(productionItem.id))
        setAnchorEl(null);
    }

    /**
     * Получить список доступных операций (пункты меню) для карты
     * @param state Состояние карты
     */
    function getAvailableOperations(state: number) : ReactNode[] {
        const operations: ReactNode[] = []
        if (state === CARD_STATE_DRAFT) {
            operations.push(<MenuItem key={1} onClick={handleMenuCardToWork}>В работу</MenuItem>)

        }
        if (state === CARD_STATE_IN_WORK) {
            operations.push(<MenuItem key={2} onClick={handleMenuCardExecute}>Выполнить</MenuItem>)
            operations.push(<MenuItem key={3} onClick={handleMenuCardCancel}>Отмена карты</MenuItem>)
        }
        if (state === CARD_STATE_READY) {operations.push(<MenuItem key={4} onClick={handleMenuPrint}>Печать</MenuItem>)}
        return operations
    }

const getCard = () => {
        // if (canRedirect) { return <Redirect to='/factory/'/> }
        return (
            <Card className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader={getCardState(productionItem.curState)}
                        title={ idProduction === NEW_RECORD_VALUE ? 'Новая производственная карта' : `Производственная карта #${productionItem.id}`}
                        avatar={<ProductionStateIcon stateIndex={productionItem.curState}/>}
                        action={
                            <IconButton aria-label="settings" aria-controls="simple-menu" onClick={cardMenuButtonClick}>
                                <MoreVertIcon />
                            </IconButton>
                        }
                    />

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        {
                            getAvailableOperations(productionItem.curState)
                        }
                    </Menu>

                    <Divider />

                    <CardContent>
                        <Paper className={classes.paper_bar}>
                            <Tabs
                                value={tab}
                                onChange={handleTabChange}
                                scrollButtons="on"
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="scrollable force tabs example"
                                centered
                            >
                                <Tab label="Основное" {...a11yProps(PAGE_MAIN)} />
                                <Tab label="Калькуляция"  {...a11yProps(PAGE_CALC)} />
                                <Tab label="Смены" {...a11yProps(PAGE_TEAM)} />
                                <Tab label="Выход продукции" {...a11yProps(PAGE_PRODUCT)} />
                            </Tabs>
                        </Paper>

                        <TabPanel value={tab} index={PAGE_MAIN}>
                            <Grid container spacing={1}>
                                <Grid item xs={11}>
                                    <Typography variant={"h5"}>
                                        Основные сведения
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper  elevation={0} className={classes.paper_root}>
                                        <TextField
                                            fullWidth
                                            label="Готовая продукция"
                                            margin="dense"
                                            name="product"
                                            onChange={handleChange}
                                            required
                                            value={productionItem.product.name}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            helperText={hasProductError ? "Обязательное поле" : ""}
                                            error={hasProductError}
                                        />
                                        {canEditCard() ? (
                                        <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeProduct}>
                                            <MenuOpenIcon />
                                        </IconButton>
                                            ):null
                                        }
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper  elevation={0} className={classes.paper_root}>
                                        <TextField
                                            fullWidth
                                            label="Рецептура расчёта"
                                            margin="dense"
                                            name="formula"
                                            onChange={handleChange}
                                            required
                                            value={productionItem.formula.id > 0 ? `№ ${productionItem.formula.id} на продукцию ${productionItem.formula.product.name}` : ''}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            helperText={hasFormulaError ? "Обязательное поле" : ""}
                                            error={hasFormulaError}
                                        />
                                        {canEditCard() ? (
                                            <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeFormula}>
                                                <MenuOpenIcon />
                                            </IconButton>
                                        ):null
                                        }
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper  elevation={0} className={classes.paper_root}>
                                        <TextField
                                            fullWidth
                                            label="Производственная линия процесса"
                                            margin="dense"
                                            name="prodLine"
                                            onChange={handleChange}
                                            required
                                            value={productionItem.prodLine.name}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            helperText={hasFactoryLineError ? "Обязательное поле" : ""}
                                            error={hasFactoryLineError}
                                        />
                                        {canEditCard() ? (
                                            <IconButton color="primary" className={classes.iconButton}
                                                        aria-label="directions" onClick={handleChangeProdLine}>
                                                <MenuOpenIcon/>
                                            </IconButton>
                                        ) :null
                                        }
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                    <Grid item xs={3} >
                                        <DateTimePicker
                                            disableToolbar
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy HH:mm"
                                            ampm={false}
                                            id="prodStart"
                                            label="Начало процесса"
                                            name="prodStart"
                                            required
                                            margin="dense"
                                            value={productionItem?.prodStart}
                                            onChange={handleDateChangeProdStart}
                                            readOnly={!canEditCard()}
                                        />
                                    </Grid>
                                <Grid item xs={3} >
                                    <KeyboardDateTimePicker
                                        disableToolbar
                                        inputVariant="outlined"
                                        format="dd/MM/yyyy HH:mm"
                                        ampm={false}
                                        margin="dense"
                                        id="prodFinish"
                                        label="Окончание процесса"
                                        name="prodFinish"
                                        value={productionItem?.prodFinish}
                                        onChange={handleDateChangeProdFinish}
                                        readOnly={!canEditCard()}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                    <Grid item xs={3} >
                                        <TextField
                                            fullWidth
                                            type={'number'}
                                            label="Рассчёт"
                                            margin="dense"
                                            name="calcValue"
                                            onChange={handleChange}
                                            required
                                            value={productionItem?.calcValue}
                                            variant="outlined"
                                            inputProps={{
                                                readOnly: Boolean(!canEditCard()),
                                                disabled: Boolean(!canEditCard()),
                                            }}
                                            helperText={hasCorrectValueError ? "Укажите корректное значение" : ""}
                                            error={hasCorrectValueError}
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <TextField
                                            fullWidth
                                            type={'number'}
                                            label="Выход"
                                            margin="dense"
                                            name="outValue"
                                            onChange={handleChange}
                                            required
                                            value={productionItem?.outValue}
                                            variant="outlined"
                                            inputProps={{
                                                readOnly: Boolean(!canEditCard()),
                                                disabled: Boolean(!canEditCard()),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2} >
                                        <TextField
                                            fullWidth
                                            type={'number'}
                                            label="Потери"
                                            margin="dense"
                                            name="lossValue"
                                            onChange={handleChange}
                                            required
                                            value={productionItem?.lossValue}
                                            variant="outlined"
                                            inputProps={{
                                                readOnly: Boolean(!canEditCard()),
                                                disabled: Boolean(!canEditCard()),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <TextField
                                            fullWidth
                                            label="Комментарий"
                                            margin="dense"
                                            name="comment"
                                            onChange={handleChange}
                                            multiline
                                            rows={4}
                                            value={productionItem?.comment}
                                            variant="outlined"
                                            inputProps={{
                                                readOnly: Boolean(!canEditCard()),
                                                disabled: Boolean(!canEditCard()),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Paper  elevation={0} className={classes.paper_root}>
                                            <TextField
                                                fullWidth
                                                label="Начальник смены"
                                                margin="dense"
                                                name="teamLeader"
                                                onChange={handleChange}
                                                required
                                                value={productionItem?.teamLeader.fio}
                                                variant="outlined"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                helperText={hasMasterError ? "Обязательное поле" : ""}
                                                error={hasMasterError}
                                            />
                                            {canEditCard() ? (
                                                <IconButton color="primary" className={classes.iconButton}
                                                            aria-label="directions" onClick={handleChangeMaster}>
                                                    <MenuOpenIcon/>
                                                </IconButton>
                                            ): null
                                            }
                                        </Paper>
                                    </Grid>

                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={PAGE_TEAM}>
                            <Grid container spacing={1}>
                                <Grid item xs={11}>
                                    <Typography variant={"h5"}>
                                        Список сотрудников работающих в смене
                                    </Typography>
                                </Grid>
                                {
                                    canEditCard() &&
                                    <Grid item xs={1}>
                                        <Tooltip title={'Добавить смену сотрудника'}>
                                            <Fab color="default" aria-label="add" onClick={(event => handleAddTeamItem(idProduction))}>
                                                <AddIcon/>
                                            </Fab>
                                        </Tooltip>
                                    </Grid>
                                }
                                {
                                    productionTeam.map((team: any) =>(
                                    <ProductionTeamItem
                                        key={team.id}
                                        item={team}
                                        onChangeItem={handleChangeTeamItem}
                                        onDeleteItem={handleDeleteTeamItem}
                                        canEdit={canEditCard()}
                                    />
                                    ))
                                }
                            </Grid>
                        </TabPanel>
                        <TabPanel index={tab} value={PAGE_CALC}>
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <Typography variant={"h5"}>
                                        Калькуляция сырья
                                    </Typography>
                                </Grid>
                                {canEditCard() &&
                                    <Grid item xs={1}>
                                        <Tooltip title={'Добавить автоматически рассчитанную калькуляцию'}>
                                            <Fab color="default" aria-label="add"
                                                 onClick={(event => handleAddCalcAuto())}>
                                                <LayersIcon/>
                                            </Fab>
                                        </Tooltip>
                                    </Grid>
                                }
                                {canEditCard() &&
                                    <Grid item xs={1}>
                                        <Tooltip title={'Добавить сырьё в калькуляцию'}>
                                            <Fab color="default" aria-label="add" onClick={(event => handleAddCalcItem(idProduction))}>
                                                <AddIcon/>
                                            </Fab>
                                        </Tooltip>
                                    </Grid>
                                }
                                {productionCalc.map((calc: any) =>(
                                    <ProductionCalcItem
                                        item={calc}
                                        onChangeItem={handleChangeCalcItem}
                                        onDeleteItem={handleDeleteCalcItem}/>
                                ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel index={tab} value={PAGE_PRODUCT}>
                            <Grid container spacing={1}>
                                <Grid item xs={11}>
                                    <Typography variant={"h5"}>
                                        Упаковка готовой продукции
                                    </Typography>
                                </Grid>
                                { canEditCard() &&
                                    <Grid item xs={1}>
                                        <Tooltip title={'Добавить готовую продукцию'}>
                                            <Fab color="default" aria-label="add" onClick={(event => handleAddTareItem(idProduction))}>
                                                <AddIcon/>
                                            </Fab>
                                        </Tooltip>
                                    </Grid>
                                }
                                {productionTare.map((tare: any) =>(
                                    <ProductionTareItem
                                        item={tare}
                                        onChangeItem={handleChangeTareItem}
                                        onDeleteItem={handleDeleteTareItem}
                                        canEdit={canEditCard()}
                                    />
                                ))}
                            </Grid>
                        </TabPanel>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button color="primary" variant="contained" type="submit">
                            Сохранить
                        </Button>
                        <Button color="default" variant="contained" onClick={(event => history.push('/factory/'))}>
                            Закрыть
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

export default ProductionDetails;
