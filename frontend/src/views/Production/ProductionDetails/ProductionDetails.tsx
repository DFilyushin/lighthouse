import React, {Fragment, useEffect} from 'react';
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
import {useDispatch, useSelector} from "react-redux";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import AddIcon from '@material-ui/icons/Add';
import CircularIndeterminate from "components/Loader/Loader";
import SelectItemDialog from "components/SelectItemDialog";
import { useConfirm } from "material-ui-confirm";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import {useDialog} from "components/SelectDialog";
import {IStateInterface} from "redux/rootReducer";
import {
    changeProductionCard, deleteCalcItem, deleteTeamItem,
    getProductionCalc,
    getProductionTeam,
    loadProductionCard, updateCalcItem
} from "redux/actions/productionAction";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {KeyboardDateTimePicker} from "@material-ui/pickers";
import ProductionTeamItem from "../components/ProductionTeamItem";
import ProductionCalcItem from "../components/ProductionCalcItem/ProductionCalcItem";
import {IProductionCalc} from "types/model/production";
import {loadRaws} from "redux/actions/rawAction";
import {loadProduct} from "redux/actions/productAction";
import {loadFactoryLines} from "redux/actions/factoryLineAction";

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

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Fragment>
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
        </Fragment>
    );
}

const ProductionDetails = (props: IProductionDetailsProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const paramId = props.match.params.id;
    const idProduction = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, match, ...rest } = props;

    const productionItem = useSelector((state: IStateInterface)=> state.production.prodCardItem);
    const productionTeam = useSelector((state: IStateInterface)=> state.production.prodCardTeam);
    const productionCalc = useSelector((state: IStateInterface)=> state.production.prodCardCalc);
    const selectDialog = useDialog();
    const isLoading = useSelector((state: IStateInterface) => state.production.isLoading);
    // const errorValue = useSelector((state: any) => state.formula.error);
    const hasError = useSelector((state: IStateInterface) => state.production.hasError);
    const productItems = useSelector((state: IStateInterface) => state.product.products);
    const rawItems = useSelector((state: IStateInterface) => state.raw.raws);
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
        dispatch(loadProduct());
        selectDialog(
            {
                'title': 'Выбор продукции',
                description: '.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: productItems,
                initKey: 0
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
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.MouseEvent) => {
        // if (formulaId === 0) {
        //     dispatch(addNewFormula(productionItem));
        // } else {
        //     dispatch(updateFormula(productionItem));
        // }
        // if (!hasError) history.push('/catalogs/formula');
    };

    const handleChangeTeamItem = (id: number)=> {

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

    /**
     * Изменение вкладки
     * @param event
     * @param newValue - Индекс новой вкладки
     */
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
        switch (newValue) {
            case PAGE_TEAM: if (productionTeam.length === 0) dispatch(getProductionTeam(idProduction));
            case PAGE_CALC: if (productionCalc.length === 0) dispatch(getProductionCalc(idProduction));
        }
    };

    useEffect( ()=> {
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
        console.log(date);
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...productionItem, 'prodStart': strDate as string};
        dispatch(changeProductionCard(item))
    };

    const handleDateChangeProdFinish = (date: Date | null) => {
        console.log(date?.toISOString());
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...productionItem, 'prodFinish': strDate as string};
        dispatch(changeProductionCard(item))
    };

    /**
     * Изменить сырьё для калькуляции
     * @param id Код записи
     */
    const handleChangeCalcItem = (id: number) => {
        dispatch(loadRaws());
        selectDialog(
            {
                'title': 'Выбор сырья',
                description: '.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: rawItems,
                initKey: 0
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



    const getCard = () => {
        return (
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
                    <CardHeader subheader={productionItem.id} title="Производственная карта"/>
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
                            <Grid container spacing={3}>
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
                                        <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeProduct}>
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
                                    <Grid item xs={6} >
                                        <Paper  elevation={0} className={classes.paper_root}>
                                            <TextField
                                                fullWidth
                                                label="Начальник смены"
                                                margin="dense"
                                                name="prodLine"
                                                onChange={handleChange}
                                                required
                                                value={productionItem?.teamLeader.fio}
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
                                    <Grid item xs={6} >
                                        <TextField
                                            fullWidth
                                            label="Должность"
                                            margin="dense"
                                            name="teamLeader"
                                            onChange={handleChange}
                                            value={productionItem?.teamLeader.staff}
                                            variant="outlined"
                                        />
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
                                <Grid item xs={1} >
                                    <Fab color="default" aria-label="add" >
                                        <AddIcon />
                                    </Fab>
                                </Grid>
                                {productionTeam.map((team: any) =>(
                                    <ProductionTeamItem
                                        item={team}
                                        onChangeItem={handleChangeTeamItem}
                                        onDeleteItem={handleDeleteTeamItem}/>
                                ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel index={tab} value={PAGE_CALC}>
                            <Grid container spacing={3}>
                                {productionCalc.map((calc: any) =>(
                                    <ProductionCalcItem
                                        item={calc}
                                        onChangeItem={handleChangeCalcItem}
                                        onDeleteItem={handleDeleteCalcItem}/>
                                ))}
                            </Grid>
                        </TabPanel>

                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button color="primary" variant="contained" onClick={saveHandler}>
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
