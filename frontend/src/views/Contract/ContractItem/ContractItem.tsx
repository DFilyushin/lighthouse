import React, {Fragment, useState, useEffect, SyntheticEvent, ReactNode} from 'react'
import {RouteComponentProps} from "react-router"
import moment from "moment"
import 'moment/locale/ru'
import {makeStyles} from '@material-ui/core/styles'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    Tab,
    Tabs,
    Paper,
    IconButton,
    Menu,
    Fab,
    Tooltip,
    Typography,
    MenuItem,
    TextField
} from '@material-ui/core'
import {Redirect, useHistory} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import AddIcon from "@material-ui/icons/Add"
import MoreVertIcon from '@material-ui/icons/MoreVert'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {
    addNewContract,
    addNewSpecItem,
    calculateDiscount,
    changeContractItem,
    changeContractSpecItem,
    deleteContractReserveProduct,
    deleteContractSpecItem,
    loadContractItem,
    setContractStatus,
    updateContract
} from "redux/actions/contractAction"
import {
    CONTRACT_STATE_ACTIVE,
    CONTRACT_STATE_DRAFT,
    CONTRACT_STATE_READY,
    ContractStateString,
    IContractSpecItem
} from "types/model/contract"
import {IClientItemList, nullClientItem} from "types/model/client"
import {Autocomplete} from "@material-ui/lab"
import {searchClients} from "redux/actions/clientAction"
import {
    DIALOG_ASK_DELETE, DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES, NEW_RECORD_TEXT,
    NEW_RECORD_VALUE
} from "../../../utils/AppConst"
import TabPanel from "../../Production/components/TabPanel"
import ContractPaymentTable from "../components/ContractPaymentTable"
import ContractWaitPaymentTable from "../components/ContractWaitPaymentTable"
import {getSetupNdsRate} from "../../../redux/actions/setupAction";
import {loadTare} from "../../../redux/actions/tareAction";
import {loadActualPriceListByEmployee} from "../../../redux/actions/priceAction";
import {showInfoMessage} from "../../../redux/actions/infoAction";
import AuthenticationService from "../../../services/Authentication.service";
import ContractSkeletonLoading from "../components/ContractSkeletonLoading";
import ContractAccessTable from "../components/ContractAccessList";
import {ContractSpecTable} from "../components/ContractSpec";
import ContractSpecPanel from "../components/ContractSpecPanel";
import ContractReserveTable from "../components/ContractReserveProduct/ContractReserveTable";
import {useConfirm} from "material-ui-confirm";
import DialogContent from "@material-ui/core/DialogContent";
import {ReserveItem} from "../../index";
import Dialog, {DialogProps} from '@material-ui/core/Dialog';
import {addNewReserveByContractSpecPosition} from "../../../redux/actions/storeAction";

interface IContractItemProps extends RouteComponentProps {
    className: string,
    match: any
}

const PAGE_MAIN = 0
const PAGE_SPEC = 1
const PAGE_WAIT_PAYMENT = 2
const PAGE_PAYMENT = 3
const PAGE_RESERVE = 4
const PAGE_ADVANCE = 5


const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1)
    },
    buttonTop: {
        marginTop: 4,
    },
    controlBottom: {
        marginBottom: 4,
        marginRight: 4
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center'
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    formControl: {
        margin: theme.spacing(1),
    },
    iconButton: {
        padding: 5,
    },
    footer_row: {
        fontSize: "1.3rem",
    },
    table: {
        minWidth: 650,
    },
    fab: {
        //position: 'static',
        //bottom: theme.spacing(2),
        //right: theme.spacing(2),
    },
}));

//FIXME Выделить компонент "Таблица спецификации"
//FIXME Упростить компонент, разбить на более мелкие
//FIXME После добавления резерва продукции обновлять список Продукция в резерве

const ContractItem = (props: IContractItemProps) => {
    const confirm = useConfirm()
    const paramId = props.match.params.id;
    const contractId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE : parseInt(paramId);
    const {className, ...rest} = props;
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = new URLSearchParams(props.location.search);
    const querySource = query.get('source') || 'contract'
    const querySourceId = query.get('id')

    const [open, setOpen] = React.useState(false);
    // eslint-disable-next-line
    const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');


    const [tab, setTab] = React.useState(PAGE_MAIN);
    const [specNum, setSpecNum] = React.useState('1')
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [hasLoad, setLoad] = useState<boolean>(false)
    const contractItem = useSelector((state: IStateInterface) => state.contract.contractItem)
    const loading = useSelector((state: IStateInterface) => state.contract.isLoading)
    const clients = useSelector((state: IStateInterface) => state.client.searchClients)
    const products = useSelector((state: IStateInterface) => state.price.priceList)
    const tares = useSelector((state: IStateInterface) => state.tare.tareItems)
    const contractNotFound = useSelector((state: IStateInterface) => state.contract.contractNotFound)
    const [dataSource, setDataSource] = useState<IClientItemList[]>([])
    const [curClient, setCurClient] = useState<IClientItemList | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [showDeliveryBlock, setShowDeliveryBlock] = useState(false)

    const [hasClientError, setClientError] = useState(false)
    const [hasSpecError, setSpecError] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        const property: string = event.target.name;
        // @ts-ignore
        const typeOfProperty: string = typeof (contractItem[property]);
        if (typeOfProperty === 'number') {
            value = parseFloat(event.target.value);
        } else {
            value = event.target.value;
        }
        const item = {...contractItem, [event.target.name]: value};
        dispatch(changeContractItem(item))
    };

    const contractMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    /**
     * Удаление позиции из спецификации
     * @param id Код записи
     */
    function onDeleteSpecItem(id: number) {
        dispatch(deleteContractSpecItem(id))
    }

    /**
     * Изменение позиции в спефикации
     * @param item Объект позиции
     */
    function onChangeSpecItem(item: IContractSpecItem) {
        dispatch(changeContractSpecItem(item))
    }

    /**
     * Резервировать элемент
     * @param id
     */
    function onReserveSpecItem(id: number) {
        dispatch(addNewReserveByContractSpecPosition(id))
        setOpen(true)
    }

    /**
     * Сохранение изменений через промисы
     * @param dispatch
     */
    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        if (contractId === NEW_RECORD_VALUE) {
            await dispatch(addNewContract(contractItem));
        } else {
            await dispatch(updateContract(contractItem));
        }
        resolve();
    });

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        event.preventDefault();
        if (isValid()) {
            saveItem(dispatch).then(() => {
                    history.push('/contracts/');
                }
            )
        } else {
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
    }

    /**
     * Проверка валидности формы
     */
    function isValid(): boolean {
        const checkClient = (contractItem.client.id !== 0)
        let checkSpec: boolean = true
        for (const item of contractItem.specs) {
            if ((item.product.id === 0) || (item.tare.id === 0)) {
                checkSpec = false
                break
            }
        }
        setClientError(!checkClient)
        setSpecError(!checkSpec)
        return checkClient && checkSpec
    }

    useEffect(() => {
        const loadData = () => {
            setCurClient({
                id: contractItem.client.id,
                clientBin: contractItem.client.reqBin,
                clientAgent: contractItem.client.clientAgent,
                clientEmployee: contractItem.client.clientEmployee,
                clientAddr: contractItem.client.clientAddr,
                clientName: contractItem.client.clientName
            });
        }
        if (!hasLoad) {
            setLoad(true);
            dispatch(loadContractItem(contractId, loadData));
            dispatch(getSetupNdsRate())
            dispatch(loadActualPriceListByEmployee(AuthenticationService.currentEmployeeId()))
            dispatch(loadTare())
        }

        if (contractItem.client.id !== 0 && curClient) {
            setCurClient({
                id: contractItem.client.id,
                clientBin: contractItem.client.reqBin,
                clientAgent: contractItem.client.clientAgent,
                clientEmployee: contractItem.client.clientEmployee,
                clientAddr: contractItem.client.clientAddr,
                clientName: contractItem.client.clientName
            });
        }


        if (inputValue.length < 4 || inputValue === curClient?.clientName) {
            return undefined;
        } else {
            const newClients: IClientItemList[] = [];
            dispatch(searchClients(inputValue));
            clients.forEach((value) => {
                newClients.push(value);
            })
            setDataSource(newClients);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoad, inputValue, contractItem.client.id]);


    function a11yProps(index: any) {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
        };
    }


    function onChangeClient(event: object, value: IClientItemList | null, reason: string) {
        setCurClient(value);
        if (value) {
            const newClient = {
                ...nullClientItem,
                id: value.id,
                clientName: value.clientName,
                clientAddr: value.clientAddr,
                clientEmployee: value.clientEmployee,
                clientAgent: value.clientAgent
            }
            const newState = {...contractItem, 'client': newClient}
            dispatch(changeContractItem(newState));
        }
    }

    /**
     * Печать контракта
     */
    const handlePrint = () => {
        // печать ...
        setAnchorEl(null)
    }

    /**
     * Ввод оплаты по контракту
     */
    const handleAddPayment = () => {
        history.push(`/payments/new/?contractId=${contractId}&source=contract&id=${contractId}`)
    }

    /**
     * Изменение вкладки
     * @param event
     * @param newValue - Индекс новой вкладки
     */
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    }

    function handleContractToWork() {
        dispatch(setContractStatus(CONTRACT_STATE_ACTIVE))
    }

    function handleContractToDraft() {
        dispatch(setContractStatus(CONTRACT_STATE_DRAFT))
    }

    function handleContractToReady() {
        dispatch(setContractStatus(CONTRACT_STATE_READY))
    }

    function getAvailableOperations(state: number) {
        const operations: ReactNode[] = []
        if (state === CONTRACT_STATE_DRAFT) {
            operations.push(<MenuItem key={1} onClick={handleContractToWork}>В работу</MenuItem>)
        }
        if (state === CONTRACT_STATE_ACTIVE) {
            operations.push(<MenuItem key={2} onClick={handleContractToDraft}>Вернуть в черновики</MenuItem>)
            operations.push(<MenuItem key={3} onClick={handleContractToReady}>Закрыть договор</MenuItem>)
            operations.push(<MenuItem key={4} onClick={handleAddPayment}>Ввод оплаты</MenuItem>)
        }
        operations.push(<MenuItem key={5} onClick={handlePrint}>Печать</MenuItem>)
        return operations
    }

    const handleCalculateDiscount = (event: SyntheticEvent) => {
        dispatch(calculateDiscount())
    }


    const handleClickContractSpecNum = (num: string) => {
        setSpecNum(num)
    }

    /**
     * Закрыть страницу с переходом в родительскую ссылку
     * @param event
     */
    const handleClose = (event: SyntheticEvent) => {
        let url = '/contracts'
        if (querySource === 'client' && querySourceId) {
            url = `/client/${querySourceId}`
        } else if (querySource === 'reserved') {
            url = `/store/reserved/${querySourceId}`
        } else if (querySource === 'return') {
            url = `/return/`
        }
        history.push(url)
    }

    const handleCloseDialog = (event: SyntheticEvent) => {
        setOpen(false)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    /**
     * Добавить новую позицию в спецификацию
     */
    const handleAddEmptySpecItem = () => {
        dispatch(addNewSpecItem(specNum))
    }

    /**
     * Добавить новую спецификацию
     */
    const handleAddNewSpec = () => {
        let maxNum = 0
        if (contractItem.specs.length !== 0) {
             maxNum = Math.max.apply(null, contractItem.specs.map(value => parseInt(value.specNum)))
        }
        const newSpecNum = maxNum + 1
        dispatch(addNewSpecItem(newSpecNum.toString()))
    }

    const handleClickShowDelivery = () => {
        setShowDeliveryBlock(!showDeliveryBlock)
    }

    const handleClickTableItem = (id: number) => {

    }

    /**
     * Переход к контракту
     * @param id Код контракта
     */
    const handleClickPaymentTableItem = (id: number) => {
        history.push(`/payments/${id}/?source=contract&id=${contractId}`)
    }
    /**
     * Просмотр подробностей по резервированию продукции
     * @param id Код записи
     */
    const handleClickReserveItem = (id: number) => {
        history.push(`/store/reserved/${id}/`)
    }

    /**
     * Удаление записи резерва продукции
     * @param id Код записи
     */
    const handleDeleteReserveItem = (id: number) => {
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() => {
            dispatch(deleteContractReserveProduct(id))
        })
    }

    /**
     * Возможность редактирования контракта
     */
    const canEditContract = () => {
        return (contractItem.contractState === CONTRACT_STATE_DRAFT)
            || (contractItem.contractState === CONTRACT_STATE_ACTIVE)
    }

    if (contractNotFound) {
        return (
            <div>
                <Redirect to={'/NotFound'}/>
            </div>
        )
    } else {
        return (
            <div className={classes.root}>
                <Card
                    {...rest}
                    className={className}
                >
                    <form
                        autoComplete="off"
                        onSubmit={saveHandler}
                    >
                        <CardHeader
                            subheader={ContractStateString[contractItem.contractState]}
                            title="Контракт"
                            action={
                                <IconButton aria-label="settings" aria-controls="simple-menu"
                                            onClick={contractMenuButtonClick}>
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
                            {getAvailableOperations(contractItem.contractState)}
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
                                    <Tab label="Общие сведения" {...a11yProps(PAGE_MAIN)} />
                                    <Tab label="Спецификации" {...a11yProps(PAGE_SPEC)} />
                                    <Tab label="График платежей" {...a11yProps(PAGE_WAIT_PAYMENT)} />
                                    <Tab label="Оплаты по контракту"  {...a11yProps(PAGE_PAYMENT)} />
                                    <Tab label="Резервирование"  {...a11yProps(PAGE_RESERVE)} />
                                    <Tab label="Дополнительно" {...a11yProps(PAGE_ADVANCE)} />
                                </Tabs>
                            </Paper>
                            <TabPanel value={tab} index={PAGE_MAIN}>
                                {loading ?
                                    <ContractSkeletonLoading height={200} animation="wave"/>
                                    : (
                                        <Fragment>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} md={12}>
                                                    <Autocomplete
                                                        autoComplete
                                                        getOptionLabel={option => option.clientName}
                                                        noOptionsText={'Не выбран  клиент, начните набирать текст...'}
                                                        options={dataSource as IClientItemList[]}
                                                        onChange={onChangeClient}
                                                        value={curClient}
                                                        clearText={'Очистить'}
                                                        renderOption={option => (
                                                            <Grid container alignItems="center">
                                                                <Grid item>
                                                                    {option.clientName}
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        &nbsp;&nbsp;{option.clientEmployee}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                        onInputChange={(event, newInputValue) => {
                                                            setInputValue(newInputValue);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                margin="dense"
                                                                label="Клиент"
                                                                variant="outlined"
                                                                fullWidth
                                                                helperText={hasClientError ? "Обязательное поле" : ""}
                                                                error={hasClientError}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item md={2} xs={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Номер"
                                                        margin="dense"
                                                        name="num"
                                                        onChange={handleChange}
                                                        required
                                                        value={contractItem.num}
                                                        variant="outlined"
                                                        inputProps={{'maxLength': 8}}
                                                        InputProps={{
                                                            readOnly: !canEditContract(),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={2} xs={2}>
                                                    <TextField
                                                        fullWidth
                                                        id="outlined-multiline-flexible"
                                                        label="Дата контракта"
                                                        type={"date"}
                                                        margin="dense"
                                                        name="contractDate"
                                                        value={contractItem.contractDate}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: !canEditContract(),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={2} xs={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="Номер контракта по 1C"
                                                        margin="dense"
                                                        name="contractId"
                                                        onChange={handleChange}
                                                        value={contractItem.contractId}
                                                        variant="outlined"
                                                        inputProps={{'maxLength': 10}}
                                                        InputProps={{
                                                            readOnly: !canEditContract(),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={2} xs={2}>
                                                    <TextField
                                                        fullWidth
                                                        label="% скидки"
                                                        margin="dense"
                                                        name="discount"
                                                        onChange={handleChange}
                                                        required
                                                        value={contractItem.discount}
                                                        variant="outlined"
                                                        type={'number'}
                                                        InputProps={{
                                                            readOnly: !canEditContract(),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={1} xs={1}>
                                                    {
                                                        canEditContract() &&
                                                        <Button
                                                            color="default"
                                                            variant="outlined"
                                                            onClick={handleCalculateDiscount}
                                                            className={classes.buttonTop}
                                                        >
                                                            Пересчитать
                                                        </Button>
                                                    }
                                                </Grid>
                                                <Grid item xs={5} md={5}/>


                                                <Grid item
                                                      md={6}
                                                      xs={6}
                                                >
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        id="outlined-multiline-flexible"
                                                        label="Условия поставки"
                                                        multiline
                                                        margin="dense"
                                                        rows="5"
                                                        name="deliveryTerms"
                                                        value={contractItem.deliveryTerms}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: !canEditContract(),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        id="outlined-multiline-flexible"
                                                        label="Дополнительно"
                                                        multiline
                                                        margin="dense"
                                                        rows="5"
                                                        name="comment"
                                                        value={contractItem.comment}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: !canEditContract(),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Fragment>)}
                            </TabPanel>
                            <TabPanel index={tab} value={PAGE_SPEC}>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <ContractSpecPanel
                                            items={contractItem.specs}
                                            onClickItem={handleClickContractSpecNum}
                                        />
                                    </Grid>
                                    <Grid item xs={10}>
                                        {loading ?
                                            <ContractSkeletonLoading height={100} animation={"wave"}
                                                                     className={classes.controlBottom}/>
                                            : (
                                                <Fragment>
                                                    {canEditContract() &&
                                                    <Grid container>
                                                        <Grid item xs={11}>
                                                            <Button
                                                                variant="contained" color="primary"
                                                                className={classes.controlBottom}
                                                                startIcon={<AddIcon/>}
                                                                onClick={handleAddNewSpec}>
                                                                Спецификация
                                                            </Button>
                                                            <Button
                                                                variant="contained" color="primary"
                                                                className={classes.controlBottom}
                                                                startIcon={<AddIcon/>}
                                                                onClick={handleAddEmptySpecItem}>
                                                                Продукт
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <Tooltip title={'Показать/скрыть раздельную доставку'}>
                                                                <Fab color="primary"
                                                                     aria-label="add"
                                                                     size="small"
                                                                     onClick={handleClickShowDelivery}
                                                                     variant="round"
                                                                >
                                                                    {
                                                                        showDeliveryBlock ? <VisibilityIcon/> :
                                                                            <VisibilityOffIcon/>
                                                                    }
                                                                </Fab>
                                                            </Tooltip>
                                                        </Grid>
                                                    </Grid>
                                                    }
                                                    {hasSpecError &&
                                                    <Grid item xs={12}>
                                                        <Typography color={"error"}>
                                                            Проверьте корректность спецификации...
                                                        </Typography>
                                                    </Grid>
                                                    }
                                                    <ContractSpecTable
                                                        canEditContract={canEditContract()}
                                                        classes={classes}
                                                        showDeliveryBlock={showDeliveryBlock}
                                                        items={contractItem.specs.filter(item => item.specNum === (specNum))}
                                                        onDeleteSpecItem={onDeleteSpecItem}
                                                        onChangeSpecItem={onChangeSpecItem}
                                                        onReserveItem={onReserveSpecItem}
                                                        products={products}
                                                        tares={tares}
                                                    />
                                                </Fragment>
                                            )}
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={tab} index={PAGE_WAIT_PAYMENT}>
                                <ContractWaitPaymentTable
                                    className={''}
                                    contract={contractItem.id}
                                    items={contractItem.waitPayments}
                                    onClickTableItem={handleClickTableItem}
                                />
                            </TabPanel>
                            <TabPanel value={tab} index={PAGE_PAYMENT}>
                                <ContractPaymentTable
                                    className={''}
                                    contract={contractItem.id}
                                    items={contractItem.payments}
                                    onClickTableItem={handleClickPaymentTableItem}
                                />
                            </TabPanel>
                            <TabPanel value={tab} index={PAGE_RESERVE}>
                                <ContractReserveTable
                                    className={''}
                                    contract={contractItem.id}
                                    items={contractItem.reserveProducts}
                                    onDeleteTableItem={handleDeleteReserveItem}
                                    onClickTableItem={handleClickReserveItem}
                                />
                            </TabPanel>
                            <TabPanel value={tab} index={PAGE_ADVANCE}>
                                {contractId !== NEW_RECORD_VALUE &&
                                <Grid container spacing={1}>
                                    <Grid item xs={10} sm={10}>
                                        <TextField
                                            fullWidth
                                            disabled
                                            label="Договор зарегистрирован"
                                            margin="dense"
                                            name="agent"
                                            value={contractItem.agent.fio}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={2}>
                                        <TextField
                                            disabled
                                            label="Дата"
                                            margin="dense"
                                            name="created"
                                            value={moment(contractItem.created).isValid() ? moment(contractItem.created).format('YYYY.MM.DD') : ''}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                }
                                <Typography variant={"h3"}>
                                    Предоставление доступа к контракту другим сотрудникам
                                </Typography>
                                <ContractAccessTable className={''} contract={contractItem.id}
                                                     items={contractItem.employeeAccess}/>
                            </TabPanel>
                        </CardContent>
                        <Divider/>
                        <CardActions>
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                            >
                                Сохранить
                            </Button>
                            <Button
                                color="default"
                                variant="contained"
                                onClick={handleClose}
                            >
                                Отменить
                            </Button>
                        </CardActions>
                    </form>
                </Card>

                <Dialog
                    fullWidth={true}
                    maxWidth={maxWidth}
                    open={open}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogContent>
                        <ReserveItem className={''} match={''} dialogStyle={false} history={rest.match}
                                     location={rest.match.location} closeHandle={handleCloseDialog}/>
                    </DialogContent>
                </Dialog>


            </div>
        )
    }
};

export default ContractItem;
