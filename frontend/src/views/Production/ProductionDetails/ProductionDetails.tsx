import React, {Fragment, ReactNode, SyntheticEvent, useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField,
    Fab,
    IconButton,
    Typography,
    Paper,
    Tab,
    Tabs,
    Tooltip,
    Menu,
    MenuItem
} from '@material-ui/core'
import {useHistory} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import MenuOpenIcon from "@material-ui/icons/MenuOpen"
import AddIcon from '@material-ui/icons/Add'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import CircularIndeterminate from "components/Loader/Loader"
import {useConfirm} from "material-ui-confirm"
import {useDialog} from "components/SelectDialog"
import {IStateInterface} from "redux/rootReducer"
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
    newTareItem,
    executeCard,
    sendCardToWork,
    cancelCard,
    addNewProduction,
    getOriginalCalculation,
    getProductionMaterial,
    deleteMaterialItem,
    updateMaterialItem,
    newMaterialItem,
    addTeamByTemplate
} from "redux/actions/productionAction"
import LayersIcon from '@material-ui/icons/Layers'
import ProductionTeamItem from "../components/ProductionTeamItem"
import ProductionCalcItem from "../components/ProductionCalcItem/ProductionCalcItem"
import {
    CARD_STATE_DRAFT,
    CARD_STATE_IN_WORK,
    CARD_STATE_READY,
    CardStateString,
    IProductionCalc,
    IProductionMaterial,
    IProductionTare,
    IProductionTeam
} from "types/model/production"
import {loadProduct} from "redux/actions/productAction"
import {loadFactoryLines} from "redux/actions/factoryLineAction"
import ProductionTareItem from "../components/ProductionTareItem"
import ProductionStateIcon from '../components/ProductionStateIcon'
import TabPanel from "../components/TabPanel"
import {loadEmployeeList} from "redux/actions/employeeAction"
import {loadTare} from "redux/actions/tareAction"
import {ITare} from "types/model/tare"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import {
    DIALOG_ASK_DELETE,
    DIALOG_CANCEL_TEXT,
    DIALOG_NO,
    DIALOG_SELECT_TEXT,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES,
    NEW_RECORD_TEXT,
    NEW_RECORD_VALUE,
    SELECT_PRODUCT,
    SELECT_RAW,
    SELECT_STOCK
} from "utils/AppConst"
import {showInfoMessage} from "redux/actions/infoAction"
import {loadFormulaReference} from "redux/actions/formulaAction"
import {loadWorkList} from "../../../redux/actions/workAction"
import ProductionMaterialItem from "../components/ProductionMaterialItem"
import {loadUnit} from "../../../redux/actions/unitAction"
import {loadRaws} from "../../../redux/actions/rawAction"
import {loadTeamTemplateList} from "../../../redux/actions/teamAction";
import {loadStockList} from "../../../redux/actions/stockAction";

const PAGE_MAIN = 0;
const PAGE_CALC_ORIGINAL = 1;
const PAGE_CALC = 2;
const PAGE_TEAM = 3;
const PAGE_PRODUCT = 4;
const PAGE_MATERIAL = 5;


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
    const {className, match} = props;
    const paramId = match.params.id;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [tab, setTab] = React.useState(PAGE_MAIN);

    const productionItem = useSelector((state: IStateInterface) => state.production.prodCardItem)
    const productionTeam = useSelector((state: IStateInterface) => state.production.prodCardTeam)
    const calculationFact = useSelector((state: IStateInterface) => state.production.prodCardCalc)
    const calculationOriginal = useSelector((state: IStateInterface) => state.production.prodCardOriginalCalc)
    const productionTare = useSelector((state: IStateInterface) => state.production.prodCardTare)
    const productionMaterial = useSelector((state: IStateInterface) => state.production.prodCardMaterial)
    const isLoading = useSelector((state: IStateInterface) => state.production.isLoading)
    const productItems = useSelector((state: IStateInterface) => state.product.products)
    const rawItems = useSelector((state: IStateInterface) => state.raw.raws)
    const unitItems = useSelector((state: IStateInterface) => state.unit.unitItems)
    const tareItems = useSelector((state: IStateInterface) => state.tare.tareItems)
    const prodLinetItems = useSelector((state: IStateInterface) => state.factoryLine.lineItems)
    const employeeItems = useSelector((state: IStateInterface) => state.employee.employeeItems)
    const workItems = useSelector((state: IStateInterface) => state.works.workItems)
    const formulas = useSelector((state: IStateInterface) => state.formula.formulasForSelect)
    const stockItems = useSelector((state: IStateInterface) => state.stock.stocks)
    const teamTemplates = useSelector((state: IStateInterface) => state.team.teamItems)

    const [idProduction, setIdProduction] = useState(paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE : parseInt(paramId))
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
        if (event.target.name === 'calcValue') {
            setCorrectValueError(false)
        }
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
                title: 'Выбор продукции',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: productItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = {...productionItem, product: {id: value.id, name: value.name}}
                dispatch(changeProductionCard(item))
                dispatch(loadFormulaReference(value.name))
                setProductError(false)
            }
        );
    };

    const handleChangeFormula = () => {
        selectDialog(
            {
                title: 'Выбор рецептуры расчёта продукции',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: formulas,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = {
                    ...productionItem,
                    formula: {
                        id: value.id,
                        created: '',
                        product: {id: 0, name: value.name},
                        calcAmount: 0,
                        calcLosses: 0,
                        specification: '',
                        density: 0,
                        raws: []
                    },
                    idFormula: value.id
                }
                dispatch(changeProductionCard(item))
                setFormulaError(false);
            }
        );
    }

    const handleChangeMaster = () => {
        selectDialog(
            {
                title: 'Выбор начальника смены',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: employeeItems,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value: any) => {
                const item = {...productionItem, teamLeader: {id: value.id, fio: value.name, staff: '', tabNum: ''}};
                dispatch(changeProductionCard(item));
                setMasterError(false)
            }
        )
    }

    /**
     * Добавить новую запись смены
     */
    const handleAddTeamItem = () => {
        dispatch(newTeamItem())
    }

    /**
     * Добавить список сотрудников в смену по шаблону
     */
    const handleAddTeamByTemplate = () => {
        // Выбрать шаблон
        selectDialog(
            {
                title: 'Выбор шаблона',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: teamTemplates,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                dispatch(addTeamByTemplate(value.id));
            }
        )
    }

    /**
     * Добавить новую запись с готовой продукцией
     * @param id
     */
    function handleAddTareItem(id: number) {
        dispatch(newTareItem())
    }

    /**
     * Добавить новую запись с материалом
     * @param id
     */
    function handleAddMaterialItem(id: number) {
        dispatch(newMaterialItem())
    }

    /**
     * Добавить новую запись калькуляции
     */
    const handleAddCalcItem = () => {
        dispatch(newCalcItem())
    };

    /**
     * Добавить автоматически рассчитанную калькуляцию
     */
    const handleAddCalcAuto = () => {
        if (calculationFact.length > 0) {
            confirm(
                {
                    title: DIALOG_TYPE_CONFIRM,
                    description: `Добавление автоматической калькуляции удалит имеющиеся записи. Продолжить?.`,
                    confirmationText: DIALOG_YES,
                    cancellationText: DIALOG_NO
                }
            ).then(() => {
                dispatch(getAutoCalculation())
            });
        } else {
            dispatch(getAutoCalculation())
        }

    };

    /**
     * Сменить сотрудника в смене
     * @param id
     */
    const handleChangeTeamItem = (id: number) => {
        selectDialog(
            {
                title: 'Выбор сотрудника',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: employeeItems,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value: any) => {
                const item = [...productionTeam];
                const index = item.findIndex((item: IProductionTeam) => {
                    return item.id === id
                });
                item[index].employee.id = value.id;
                item[index].employee.fio = value.name;
                dispatch(updateTeamItem(item[index]));
            }
        );
    };

    /**
     * Сменить вид работы в смене сотрудника
     * @param id
     */
    const handleChangeWorkItem = (id: number) => {
        selectDialog(
            {
                title: 'Выбор вида работы',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: workItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = [...productionTeam];
                const index = item.findIndex((item: IProductionTeam) => {
                    return item.id === id
                });
                item[index].work.id = value.id;
                item[index].work.name = value.name;
                dispatch(updateTeamItem(item[index]));
            }
        );
    };

    /**
     * Удалить запись со сменой
     * @param id
     */
    const handleDeleteTeamItem = (id: number) => {
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteTeamItem(id))
        );
    };

    /**
     * Удалить запись с готовой продукцией
     * @param id
     */
    const handleDeleteTareItem = (id: number) => {
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteTareItem(id))
        );
    };

    function handleDeleteMaterialItem(id: number) {
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteMaterialItem(id))
        );
    }

    /**
     * Изменение вкладки
     * @param event
     * @param newValue - Индекс новой вкладки
     */
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
        switch (newValue) {
            case PAGE_TEAM:
                if (!productionTeam.length) dispatch(getProductionTeam(idProduction));
                break;
            case PAGE_CALC:
                if (!calculationFact.length) dispatch(getProductionCalc(idProduction));
                break;
            case PAGE_PRODUCT:
                if (!productionTare.length) dispatch(getProductionTare(idProduction));
                break;
            case PAGE_CALC_ORIGINAL:
                if (!calculationOriginal.length) dispatch(getOriginalCalculation());
                break;
            case PAGE_MATERIAL:
                if (!productionMaterial.length) dispatch(getProductionMaterial(idProduction));
                break;
        }
    };


    useEffect(() => {
        dispatch(loadRaws())
        dispatch(loadStockList())
        dispatch(loadProduct())
        dispatch(loadFactoryLines())
        dispatch(loadEmployeeList())
        dispatch(loadWorkList())
        dispatch(loadTare())
        dispatch(loadUnit())
        dispatch(loadTeamTemplateList())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
            dispatch(loadProductionCard(idProduction));
            setTab(PAGE_MAIN);
        }, [dispatch, idProduction]
    );

    function a11yProps(index: any) {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
        };
    }


    //TODO реализовать в виде отдельного компонента
    const handleChangeProdLine = () => {
        selectDialog(
            {
                title: 'Выбор линии',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: prodLinetItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = {...productionItem}
                item.prodLine.id = value.id
                item.prodLine.name = value.name
                dispatch(changeProductionCard(item))
                setFactoryLineError(false)
            }
        );
    }

    /**
     * Изменить ед. измерения
     * @param id Код записи
     */
    const handleChangeCalcItemUnit = (id: number) => {
        selectDialog(
            {
                title: 'Выбор ед. измерения',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: unitItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = [...calculationFact];
                const index = item.findIndex((item: IProductionCalc) => {
                    return item.id === id
                });
                item[index].unit.id = value.id;
                item[index].unit.name = value.name;
                dispatch(updateCalcItem(item[index]));
            }
        );
    }

    /**
     * Изменить сырьё для калькуляции
     * @param id Код записи
     */
    const handleChangeCalcItem = (id: number, typeSelect: number) => {
        let dataItems;
        let dialogTitle;
        if (typeSelect === SELECT_RAW) {
            dataItems = rawItems
            dialogTitle = 'Выбор сырья'
        } else if (typeSelect === SELECT_PRODUCT) {
            dataItems = productItems
            dialogTitle = 'Выбор продукции'
        } else {
            throw new Error('Неверно указан тип выбора для справочника!')
        }
        selectDialog(
            {
                title: dialogTitle,
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: dataItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = [...calculationFact];
                const index = item.findIndex((item: IProductionCalc) => {
                    return item.id === id
                });
                item[index].raw.id = value.id;
                item[index].raw.name = value.name;
                dispatch(updateCalcItem(item[index]));
            }
        );
    }

    /**
     * Удалить запись калькуляции
     * @param id
     */
    const handleDeleteCalcItem = (id: number) => {
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
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

    /**
     * Выбор материала из списка
     * @param id Код изменяемой записи
     * @param typeSelect Вид справочника: 0 - ТМЦ, 1 - продукция
     */
    function handleChangeMaterialItem(id: number, typeSelect: number) {
        let dataItems;
        let dialogTitle;
        if (typeSelect === SELECT_STOCK) {
            dataItems = stockItems
            dialogTitle = 'Выбор ТМЦ'
        } else if (typeSelect === SELECT_PRODUCT) {
            dataItems = productItems
            dialogTitle = 'Выбор продукции'
        } else {
            throw new Error('Неверно указан тип справочника выбора!')
        }

        selectDialog(
            {
                title: dialogTitle,
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: dataItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const items = [...productionMaterial];
                const index = items.findIndex((item: IProductionMaterial) => {
                    return item.id === id
                });
                items[index].materialId = value.id;
                items[index].materialName = value.name;
                dispatch(updateMaterialItem(items[index]));
            }
        );

    }

    //TODO Реализовать в виде отдельного компонента
    const handleChangeTareItem = (id: number) => {
        selectDialog(
            {
                title: 'Выбор тары',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: tareItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const items = [...productionTare];
                const index = items.findIndex((item: IProductionTare) => {
                    return item.id === id
                });
                items[index].tareId = value.id;
                items[index].tareName = value.name;
                const tareIndex = tareItems.findIndex((elem: ITare) => {
                    return elem.id === value.id
                });
                items[index].tareV = tareItems[tareIndex].v
                dispatch(updateTareItem(items[index]));
            }
        );
    };

    /**
     * Возможность редактирования карты
     */
    const canEditCard = () => {
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
        setFormulaError(!hasFormulaValue)
        setProductError(!hasProduct)
        setFactoryLineError(!hasProductionLine)
        setMasterError(!hasMaster)
        setCorrectValueError(!hasCorrectValue)
        return hasProduct && hasProductionLine && hasCorrectValue && hasMaster && hasFormulaValue
    }

    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        if (isValid()) {
            try {
                let result = 0;
                if (idProduction === NEW_RECORD_VALUE) {
                    result = await dispatch(addNewProduction(productionItem))
                } else {
                    await dispatch(updateProduction(productionItem));
                    result = idProduction
                }
                setIdProduction(result)
                resolve(result)
            } catch (e) {
                reject()
            }
        } else {
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
    });

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        event.preventDefault();
        saveItem(dispatch).then((value) => {
            history.push(`/factory/${value}`)
        }).catch((e) => {
            console.log('Error save card', e)
        });
    };

    function getCardState(state: number): string {
        return CardStateString[state]
    }

    //TODO Реализовать печать производственной карты
    function handleMenuPrint() {
    }

    /**
     * Отправка карты в работу
     */
    function handleMenuCardToWork() {
        if (idProduction === NEW_RECORD_VALUE) {
            dispatch(showInfoMessage('error', 'Перед отправкой карты в работу, её необходимо сохранить!'))
        }else{
            dispatch(sendCardToWork(productionItem.id));
            setAnchorEl(null);
        }

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
    function getAvailableOperations(state: number): ReactNode[] {
        const operations: ReactNode[] = []
        if (state === CARD_STATE_DRAFT) {
            operations.push(<MenuItem key={1} onClick={handleMenuCardToWork}>В работу</MenuItem>)

        }
        if (state === CARD_STATE_IN_WORK) {
            operations.push(<MenuItem key={2} onClick={handleMenuCardExecute}>Выполнить</MenuItem>)
            operations.push(<MenuItem key={3} onClick={handleMenuCardCancel}>Отмена карты</MenuItem>)
        }
        if (state === CARD_STATE_READY) {
            operations.push(<MenuItem key={4} onClick={handleMenuPrint}>Печать</MenuItem>)
        }
        return operations
    }

    const getCard = () => {
        return (
            <Card className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader={getCardState(productionItem.curState)}
                        title={
                            idProduction === NEW_RECORD_VALUE
                                ? 'Новая производственная карта'
                                : `Производственная карта #${productionItem.id}`
                        }
                        avatar={<ProductionStateIcon stateIndex={productionItem.curState}/>}
                        action={
                            <IconButton aria-label="settings" aria-controls="simple-menu" onClick={cardMenuButtonClick}>
                                <MoreVertIcon/>
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

                    <Divider/>

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
                                <Tab label="Калькуляция"  {...a11yProps(PAGE_CALC_ORIGINAL)} />
                                <Tab label="Калькуляция факт."  {...a11yProps(PAGE_CALC)} />
                                <Tab label="Смены" {...a11yProps(PAGE_TEAM)} />
                                <Tab label="Выход продукции" {...a11yProps(PAGE_PRODUCT)} />
                                <Tab label="Доп. материалы" {...a11yProps(PAGE_MATERIAL)} />
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
                                    <Paper elevation={0} className={classes.paper_root}>
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
                                            <IconButton color="primary" className={classes.iconButton}
                                                        aria-label="directions" onClick={handleChangeProduct}>
                                                <MenuOpenIcon/>
                                            </IconButton>
                                        ) : null
                                        }
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper elevation={0} className={classes.paper_root}>
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
                                            <IconButton color="primary" className={classes.iconButton}
                                                        aria-label="directions" onClick={handleChangeFormula}>
                                                <MenuOpenIcon/>
                                            </IconButton>
                                        ) : null
                                        }
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper elevation={0} className={classes.paper_root}>
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
                                        ) : null
                                        }
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <TextField
                                        id="prodStart"
                                        label="Начало процесса"
                                        type="datetime-local"
                                        margin="dense"
                                        value={productionItem?.prodStart}
                                        name="prodStart"
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        inputProps={{
                                            readOnly: Boolean(!canEditCard()),
                                            disabled: Boolean(!canEditCard()),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        id="prodFinish"
                                        label="Окончание процесса"
                                        type="datetime-local"
                                        margin="dense"
                                        value={productionItem?.prodFinish}
                                        name="prodFinish"
                                        onChange={handleChange}
                                        variant="outlined"
                                        inputProps={{
                                            readOnly: Boolean(!canEditCard()),
                                            disabled: Boolean(!canEditCard()),
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>

                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <Tooltip title="Рассчётное количество готовой продукции">
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
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={3}>
                                    <Tooltip title="Фактический выход продукции">
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
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={2}>
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
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
                                    <Paper elevation={0} className={classes.paper_root}>
                                        <TextField
                                            fullWidth
                                            label="Начальник производства"
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
                                        ) : null
                                        }
                                    </Paper>
                                </Grid>

                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={PAGE_CALC_ORIGINAL}>
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <Typography variant={"h5"}>
                                        Калькуляция сырья
                                    </Typography>
                                </Grid>
                                {calculationOriginal.map((calc: any, index) => (
                                    <ProductionCalcItem
                                        key={index}
                                        item={calc}
                                        onDeleteItem={handleDeleteCalcItem}
                                        onChangeUnitItem={handleChangeCalcItemUnit}
                                        canEdit={false}
                                        canDelete={false}
                                    />
                                ))}
                            </Grid>

                        </TabPanel>
                        <TabPanel value={tab} index={PAGE_CALC}>
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <Typography variant={"h5"}>
                                        Фактическая калькуляция сырья
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
                                        <Fab color="default" aria-label="add"
                                             onClick={(event => handleAddCalcItem())}>
                                            <AddIcon/>
                                        </Fab>
                                    </Tooltip>
                                </Grid>
                                }
                                {calculationFact.map((calc: IProductionCalc) => (
                                    <ProductionCalcItem
                                        key={calc.id}
                                        item={calc}
                                        onChangeUnitItem={handleChangeCalcItemUnit}
                                        onChangeMaterialItem={handleChangeCalcItem}
                                        onDeleteItem={handleDeleteCalcItem}
                                        canEdit={true}
                                        canDelete={true}
                                    />
                                ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={PAGE_TEAM}>
                            <Grid container spacing={1}>
                                <Grid item xs={10}>
                                    <Typography variant={"h5"}>
                                        Список сотрудников работающих в смене
                                    </Typography>
                                </Grid>
                                {
                                    canEditCard() &&
                                    <Fragment>
                                        <Grid item xs={1}>
                                            <Tooltip title={'Добавить смену сотрудника'}>
                                                <Fab color="default" aria-label="add"
                                                     onClick={(event => handleAddTeamItem())}>
                                                    <AddIcon/>
                                                </Fab>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Tooltip title={'Добавить список сотрудников через шаблон'}>
                                                <Fab color="default" aria-label="add"
                                                     onClick={(event => handleAddTeamByTemplate())}>
                                                    <LibraryAddIcon />
                                                </Fab>
                                            </Tooltip>
                                        </Grid>
                                    </Fragment>
                                }
                                {
                                    productionTeam.map((team: IProductionTeam) => (
                                        <ProductionTeamItem
                                            key={team.id}
                                            item={team}
                                            onChangeEmployeeItem={handleChangeTeamItem}
                                            onChangeWorkItem={handleChangeWorkItem}
                                            onDeleteItem={handleDeleteTeamItem}
                                            canEdit={canEditCard()}
                                        />
                                    ))
                                }
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={PAGE_PRODUCT}>
                            <Grid container spacing={1}>
                                <Grid item xs={11}>
                                    <Typography variant={"h5"}>
                                        Упаковка готовой продукции
                                    </Typography>
                                </Grid>
                                {canEditCard() &&
                                <Grid item xs={1}>
                                    <Tooltip title={'Добавить готовую продукцию'}>
                                        <Fab color="default" aria-label="add"
                                             onClick={(event => handleAddTareItem(idProduction))}>
                                            <AddIcon/>
                                        </Fab>
                                    </Tooltip>
                                </Grid>
                                }
                                {productionTare.map((tare: IProductionTare) => (
                                    <ProductionTareItem
                                        key={tare.id}
                                        item={tare}
                                        onChangeItem={handleChangeTareItem}
                                        onDeleteItem={handleDeleteTareItem}
                                        canEdit={canEditCard()}
                                    />
                                ))}
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tab} index={PAGE_MATERIAL}>
                            <Grid container spacing={1}>
                                <Grid item xs={11}>
                                    <Typography variant={"h5"}>
                                        Дополнительные материалы
                                    </Typography>
                                </Grid>
                                {canEditCard() &&
                                <Grid item xs={1}>
                                    <Tooltip title={'Добавить материал'}>
                                        <Fab color="default" aria-label="add"
                                             onClick={(event => handleAddMaterialItem(idProduction))}>
                                            <AddIcon/>
                                        </Fab>
                                    </Tooltip>
                                </Grid>
                                }
                                {productionMaterial.map((material: IProductionMaterial) => (
                                    <ProductionMaterialItem
                                        key={material.id}
                                        item={material}
                                        onChangeItem={handleChangeMaterialItem}
                                        onDeleteItem={handleDeleteMaterialItem}
                                        canEdit={canEditCard()}
                                    />
                                ))}
                            </Grid>
                        </TabPanel>
                    </CardContent>
                    <Divider/>
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
