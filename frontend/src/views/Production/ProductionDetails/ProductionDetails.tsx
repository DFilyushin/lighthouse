import React, {Fragment, SyntheticEvent, useEffect} from 'react';
import {Redirect} from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField, Box
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector, useStore} from "react-redux";
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
    addNewProduction,
    changeProductionCard, deleteCalcItem, deleteTareItem, deleteTeamItem,
    getProductionCalc, getProductionTare,
    getProductionTeam,
    loadProductionCard, newCalcItem, newTeamItem, updateCalcItem, updateProduction, updateTareItem, updateTeamItem
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
    CARD_STATE_IN_WORK,
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
import {loadEmployeeList} from "../../../redux/actions/employeeAction";


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
    const store = useStore();
    const confirm = useConfirm();
    const selectDialog = useDialog();
    const paramId = props.match.params.id;
    const idProduction = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, match, ...rest } = props;

    const productionItem = useSelector((state: IStateInterface)=> state.production.prodCardItem);
    const productionTeam = useSelector((state: IStateInterface)=> state.production.prodCardTeam);
    const productionCalc = useSelector((state: IStateInterface)=> state.production.prodCardCalc);
    const productionTare = useSelector((state: IStateInterface)=> state.production.prodCardTare);
    const canRedirect = useSelector((state: IStateInterface)=> state.production.canRedirect);
    const isLoading = useSelector((state: IStateInterface) => state.production.isLoading);
    const hasError = useSelector((state: IStateInterface) => state.production.hasError);
    const productItems = useSelector((state: IStateInterface) => state.product.products);
    const rawItems = useSelector((state: IStateInterface) => state.raw.raws);
    const tareItems = useSelector((state:IStateInterface) => state.tare.tareItems);
    const prodLinetItems = useSelector((state: IStateInterface) => state.factoryLine.items);
    const emplItems = useSelector((state: IStateInterface) => state.employee.items);
    const [tab, setTab] = React.useState(0);

    /**
     * Изменения основных компонентов
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...productionItem, [event.target.name]: event.target.value};
        dispatch(changeProductionCard(item))
    };

    /**
     * Сменить продукцию, на которую производится расчёт
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
                const item = {...productionItem};
                item.product.id = value.id;
                item.product.name = value.name;
                dispatch(changeProductionCard(item));
            }
        );
    };

    /**
     * Добавить новую запись смены
     * @param id
     */
    const handleAddTeamItem = (id: number)=> {
        dispatch(newTeamItem())
    };

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
                    'title': 'Подтверждение',
                    description: `Добавление автоматической калькуляции удалит имеющиеся записи. Продолжить?.`,
                    confirmationText:'Да',
                    cancellationText: 'Нет'
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
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
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
                'title': 'Подтверждение',
                description: `Удалить выбранную запись?.`,
                confirmationText:'Да',
                cancellationText: 'Нет'
            }
        ).then(() =>
            dispatch(deleteTeamItem(id))
        );
    };

    const handleDeleteTareItem = (id: number)=> {
        confirm(
            {
                'title': 'Подтверждение',
                description: `Удалить выбранную запись?.`,
                confirmationText:'Да',
                cancellationText: 'Нет'
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
        console.log('handleTabChange', productionCalc)
        switch (newValue) {
            case PAGE_TEAM: if (productionTeam.length === 0) dispatch(getProductionTeam(idProduction)); break;
            case PAGE_CALC: if (productionCalc.length === 0) dispatch(getProductionCalc(idProduction));break;
            case PAGE_PRODUCT: if (productionTare.length === 0) dispatch(getProductionTare(idProduction));break;
        }
    };

    useEffect( ()=> {
            dispatch(loadRaws());
            dispatch(loadProduct());
            dispatch(loadFactoryLines());
            dispatch(loadEmployeeList());
            dispatch(loadProductionCard(idProduction));
        }, [dispatch]
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

    const handleChangeProdLine = () => {
        selectDialog(
            {
                'title': 'Выбор линии',
                description: '.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: prodLinetItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...productionItem};
                item.prodLine.id = value.id;
                item.prodLine.name = value.name;
                dispatch(updateProduction(item));
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
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
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
                'title': 'Подтверждение',
                description: `Удалить выбранную запись?.`,
                confirmationText:'Да',
                cancellationText: 'Нет'
            }
        ).then(() =>
            dispatch(deleteCalcItem(id))
        );
    };

    const handleChangeTareItem = (id: number)=> {
        selectDialog(
            {
                'title': 'Выбор тары',
                description: '.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: tareItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = [...productionTare];
                const index = item.findIndex((item:IProductionTare, index:number, array: IProductionTare[]) => {return item.id === id});
                item[index].tareId = value.id;
                item[index].tareName = value.name;
                dispatch(updateTareItem(item[index]));
            }
        );
    };

    const canEditCard = ()=> {
        return ((productionItem.curState === CARD_STATE_DRAFT) || (productionItem.curState === CARD_STATE_IN_WORK))
    };

    const saveItem = (dispatch:any) => new Promise(async(resolve, reject) => {
        console.log('saveItem');
        try{
            await dispatch(updateProduction(productionItem));
            console.log('hasError', hasError);
            resolve()
        }catch (e) {
            reject()
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

const getCard = () => {
        // if (canRedirect) { return <Redirect to='/factory/'/> }
        return (
            <Card {...rest} className={className}>

                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader={getCardState(productionItem.curState)}
                        title={`Производственная карта #${productionItem.id}`}
                        avatar={<ProductionStateIcon stateIndex={productionItem.curState}/>}
                    />

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

                        <TabPanel value={tab} index={0}>
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
                                        />
                                        <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeProduct}>
                                            <MenuOpenIcon />
                                        </IconButton>
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
                                        />
                                        <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeProdLine}>
                                            <MenuOpenIcon />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                                    <Grid item xs={3} >
                                        <KeyboardDateTimePicker
                                            disableToolbar
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy hh:mm"
                                            ampm={false}
                                            id="date-picker-inline"
                                            label="Начало процесса"
                                            name="prodStart"
                                            required
                                            value={productionItem?.prodStart}
                                            onChange={handleDateChangeProdStart}
                                        />
                                    </Grid>
                                <Grid item xs={3} >
                                    <KeyboardDateTimePicker
                                        disableToolbar
                                        inputVariant="outlined"
                                        format="dd/MM/yyyy hh:mm"
                                        ampm={false}
                                        id="date-picker-inline"
                                        label="Окончание процесса"
                                        name="prodFinish"
                                        value={productionItem?.prodFinish}
                                        onChange={handleDateChangeProdFinish}
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
                                            />
                                                <IconButton color="primary" className={classes.iconButton}
                                                            aria-label="directions" onClick={handleChangeProduct}>
                                                    <MenuOpenIcon/>
                                                </IconButton>
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
                                        <Fab color="default" aria-label="add" onClick={(event => handleAddTeamItem(idProduction))}>
                                            <AddIcon/>
                                        </Fab>
                                    </Grid>
                                }
                                {
                                    productionTeam.map((team: any) =>(
                                    <ProductionTeamItem
                                        item={team}
                                        onChangeItem={handleChangeTeamItem}
                                        onDeleteItem={handleDeleteTeamItem}/>
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
                                        <Fab color="default" aria-label="add">
                                            <AddIcon/>
                                        </Fab>
                                    </Grid>
                                }
                                {productionTare.map((tare: any) =>(
                                    <ProductionTareItem
                                        item={tare}
                                        onChangeItem={handleChangeTareItem}
                                        onDeleteItem={handleDeleteTareItem}/>
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

export default ProductionDetails;
