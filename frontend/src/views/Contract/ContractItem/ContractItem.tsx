import React, {Fragment, useState, useEffect, SyntheticEvent, ReactNode} from 'react'
import {RouteComponentProps} from "react-router"
import moment from "moment"
import 'moment/locale/ru'
import { makeStyles } from '@material-ui/core/styles'
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
    Table,
    TableHead,
    Paper,
    Hidden,
    IconButton,
    Menu,
    Fab,
    Tooltip,
    Typography,
    MenuItem,
    TextField,
    TableRow,
    TableCell,
    TableBody
} from '@material-ui/core'
import { useHistory } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import AddIcon from "@material-ui/icons/Add"
import MoreVertIcon from '@material-ui/icons/MoreVert'
import {
    addNewContract, addNewSpecItem, calculateDiscount,
    changeContractItem, changeContractSpecItem, deleteContractSpecItem,
    loadContractItem, setContractStatus,
    updateContract
} from "redux/actions/contractAction"
import {ContractSpecItem} from "../components"
import {
    CONTRACT_STATE_ACTIVE,
    CONTRACT_STATE_DRAFT,
    CONTRACT_STATE_READY, ContractStateString,
    IContractSpecItem
} from "types/model/contract"
import { KeyboardDatePicker} from '@material-ui/pickers'
import {
    IClientItemList,
    nullClientItem
} from "types/model/client"
import {Autocomplete, Skeleton} from "@material-ui/lab"
import {searchClients} from "redux/actions/clientAction"
import {
    INVALID_DATE_FORMAT,
    NEW_RECORD_VALUE
} from "../../../utils/AppConst"
import TabPanel from "../../Production/components/TabPanel"
import ContractPaymentTable from "../components/ContractPaymentTable"
import ContractWaitPaymentTable from "../components/ContractWaitPaymentTable"
import {getSetupNdsRate} from "../../../redux/actions/setupAction";
import {loadTare} from "../../../redux/actions/tareAction";
import {loadActualPriceList} from "../../../redux/actions/priceAction";
import {RoundValue} from "../../../utils/AppUtils";
import {showInfoMessage} from "../../../redux/actions/infoAction";
import {TextFieldReadOnlyComponent} from "../../../components";

interface IContractItemProps extends RouteComponentProps{
    className: string,
    match: any
}

const PAGE_MAIN = 0
const PAGE_WAIT_PAYMENT = 1
const PAGE_PAYMENT = 2

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1)
    },
    buttonTop: {
        marginTop: 8,
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
}));


const ContractItem = (props: IContractItemProps) => {
    const paramId = props.match.params.id;
    const contractId = paramId === 'new' ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = new URLSearchParams(props.location.search);
    const querySource = query.get('source') || 'contract'
    const querySourceId = query.get('id')

    const [tab, setTab] = React.useState(PAGE_MAIN);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [hasLoad, setLoad] = useState <boolean>(false)
    const contractItem = useSelector((state: IStateInterface) => state.contract.contractItem)
    const loading = useSelector((state: IStateInterface) => state.contract.isLoading)
    const clients = useSelector((state: IStateInterface)=> state.client.searchClients)
    const products = useSelector((state:IStateInterface) => state.price.priceList)
    const tares = useSelector((state:IStateInterface) => state.tare.tareItems)
    const [dataSource, setDataSource] = useState<IClientItemList[]>([])
    const [curClient, setCurClient] = useState<IClientItemList|null>(null)
    const [inputValue, setInputValue] = useState('')

    const [hasClientError, setClientError] = useState(false)
    const [hasDeliveryError, setDeliveryError] = useState(false)
    const [hasSpecError, setSpecError] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        const property: string = event.target.name;
        // @ts-ignore
        const typeOfProperty: string = typeof (contractItem[property]);
        if ( typeOfProperty === 'number') {
            value = parseFloat(event.target.value);
        }else{
            value =  event.target.value;
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
     * Сохранение изменений через промисы
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
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
        if (isValid()){
            saveItem(dispatch).then(() => {
                    history.push('/contracts/');
                }
            )
        }else{
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
    }

    function isValid():boolean {
        const checkClient = (contractItem.client.id !== 0)
        const checkDateDelivery = (contractItem.estDelivery !== '')
        let checkSpec: boolean = true
        for (const item of contractItem.specs){
            if ((item.product.id === 0) || (item.tare.id === 0)){
                checkSpec = false
                break
            }
        }
        setClientError(!checkClient)
        setDeliveryError(!checkDateDelivery)
        setSpecError(!checkSpec)
        const result = checkClient && checkDateDelivery && checkSpec
        console.log(contractItem.estDelivery, checkSpec)
        return result
    }

    useEffect( () => {
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
            dispatch(loadActualPriceList())
            dispatch(loadTare())
        }

        if (contractItem.client.id !== 0 && curClient){
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
        }else{
            const newClients: IClientItemList[] = [];
            dispatch(searchClients(inputValue));
            clients.forEach((value)=>{
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
        if (value){
            const newClient= {
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
        switch (newValue) {
            case PAGE_MAIN:  break;
            case PAGE_WAIT_PAYMENT: break;
            case PAGE_PAYMENT: break;
        }
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
    
    function getStateName(state: number) {
        return ContractStateString[state]
    }

    function getAvailableOperations(state: number) {
        const operations: ReactNode[] = []
        if (state === CONTRACT_STATE_DRAFT){
            operations.push(<MenuItem key={1} onClick={handleContractToWork}>В работу</MenuItem>)
        }
        if (state === CONTRACT_STATE_ACTIVE){
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


    /**
     * Закрыть страницу с переходом в родительскую ссылку
     * @param event
     */
    const handleClose = (event: SyntheticEvent) => {
        let url = '/contracts'
        if (querySource === 'client' && querySourceId){
            url = `/client/${querySourceId}`
        } else if (querySource === 'reserved'){
            url = `/store/reserved/`
        }
        history.push(url)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleAddEmptySpecItem = ()=> {
        dispatch(addNewSpecItem())
    }

    const handleContractDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 10);
        const item = {...contractItem, 'contractDate': strDate as string};
        dispatch(changeContractItem(item))
    }

    const handleEstDeliveryDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 10);
        const item = {...contractItem, 'estDelivery': strDate as string};
        dispatch(changeContractItem(item))
    };
    const handleDeliveredDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 10);
        const item = {...contractItem, 'delivered': strDate as string};
        dispatch(changeContractItem(item))
    };

    const handleClickTableItem = (id: number) => {
        return
    }

    const getTotalSpecSum = (spec: IContractSpecItem[]) => {
        return RoundValue(spec.map(({ itemTotal }) => itemTotal).reduce((sum, i) => sum + i, 0));
    }

    const getTotalSumDiscount = (spec: IContractSpecItem[]) => {
        return RoundValue(spec.map(({ itemDiscount }) => itemDiscount).reduce((sum, i) => sum + i, 0));
    }


    const canEditContract = () => {
        return (contractItem.contractState === CONTRACT_STATE_DRAFT) || (contractItem.contractState === CONTRACT_STATE_ACTIVE)
    }

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
                        subheader={getStateName(contractItem.contractState)}
                        title="Контракт"
                        action={
                            <IconButton aria-label="settings" aria-controls="simple-menu" onClick={contractMenuButtonClick}>
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
                        {getAvailableOperations(contractItem.contractState)}
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
                                <Tab label="Общие сведения" {...a11yProps(PAGE_MAIN)} />
                                <Tab label="График платежей" {...a11yProps(PAGE_WAIT_PAYMENT)} />
                                <Tab label="Оплаты по контракту"  {...a11yProps(PAGE_PAYMENT)} />
                            </Tabs>
                        </Paper>
                        <TabPanel value={tab} index={PAGE_MAIN}>
                        {loading ? (
                            <Fragment>
                                <Skeleton animation="wave" height={200} width="100%" style={{ marginBottom: 2 }} />
                                <Skeleton animation="wave" height={100} width="100%" style={{ marginBottom: 2 }} />
                                <Skeleton animation="wave" height={200} width="100%" style={{ marginBottom: 2 }} />
                            </Fragment>) :(
                                <Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12}>
                                    <Autocomplete
                                        autoComplete
                                        getOptionLabel={option => option.clientName}
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
                                <Grid item md={3} xs={3}>
                                    <KeyboardDatePicker
                                        className=''
                                        inputVariant="outlined"
                                        id="dp_contractdate"
                                        label="Дата контракта"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        name="contractDate"
                                        value={contractItem?.contractDate || null}
                                        onChange={handleContractDateChange}
                                        invalidDateMessage={INVALID_DATE_FORMAT}
                                        TextFieldComponent={ !canEditContract() ? TextFieldReadOnlyComponent : TextField}
                                    />
                                </Grid>
                                <Grid item md={3} xs={3}>
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
                                <Grid item md={3} xs={3}>
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
                                <Grid item md={1} xs={1}>
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
                                <Grid item md={3} xs={3}>
                                    <KeyboardDatePicker
                                        className=''
                                        inputVariant="outlined"
                                        id="estdelivery"
                                        label="Дата поставки"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        name="estdelivery"
                                        value={contractItem.estDelivery || null}
                                        onChange={handleEstDeliveryDateChange}
                                        invalidDateMessage={INVALID_DATE_FORMAT}
                                        helperText={hasDeliveryError ? "Обязательное поле" : ""}
                                        error={hasDeliveryError}
                                        TextFieldComponent={ !canEditContract() ? TextFieldReadOnlyComponent : TextField}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={3}
                                    xs={3}
                                >
                                    <KeyboardDatePicker
                                        className=''
                                        inputVariant="outlined"
                                        id="dp_contractdate"
                                        label="Отгружено"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        name="delivered"
                                        value={contractItem.delivered || null}
                                        onChange={handleDeliveredDateChange}
                                        invalidDateMessage={INVALID_DATE_FORMAT}
                                        TextFieldComponent={ !canEditContract() ? TextFieldReadOnlyComponent : TextField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-flexible"
                                        label="Условия поставки"
                                        multiline
                                        margin="dense"
                                        rows="3"
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
                                </Fragment> )}
                            <Grid container spacing={0}>
                                {loading ?
                                    (
                                        <Fragment>
                                            <Skeleton animation="wave" height={100} style={{ marginBottom: 2 }} />
                                            <Skeleton animation="wave" height={100} width="100%" />
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <Grid item xs={11}>
                                                <Typography variant={"h5"}>
                                                    Спецификация контракта
                                                </Typography>
                                            </Grid>
                                            {canEditContract() &&
                                                <Grid item xs={1}>
                                                    <Tooltip title={'Добавить новый продукт'}>
                                                        <Fab color="default" aria-label="add" onClick={handleAddEmptySpecItem}>
                                                            <AddIcon/>
                                                        </Fab>
                                                    </Tooltip>
                                                </Grid>
                                            }
                                            {hasSpecError &&
                                                <Grid item xs={12}>
                                                    <Typography color={"error"}>
                                                        Проверьте корректность спецификации...
                                                    </Typography>
                                                </Grid>
                                            }
                                            <Table className={classes.table}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Продукт</TableCell>
                                                        <TableCell>Тара</TableCell>
                                                        <TableCell>Количество</TableCell>
                                                        <TableCell>Цена</TableCell>
                                                        <TableCell>Цена с НДС</TableCell>
                                                        <TableCell>Сумма скидки, тенге</TableCell>
                                                        <TableCell>Итого, тенге</TableCell>
                                                        <Hidden only={['xs', 'sm']}>
                                                            <TableCell>Отгрузка</TableCell>
                                                            <TableCell>Отгружен</TableCell>
                                                        </Hidden>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        contractItem.specs.map((specItem: IContractSpecItem) => (
                                                            <ContractSpecItem
                                                                key={specItem.id}
                                                                className={''}
                                                                match={''}
                                                                item={specItem}
                                                                onDeleteItem={onDeleteSpecItem}
                                                                onChangeItem={onChangeSpecItem}
                                                                productItems={products}
                                                                tareItems={tares}
                                                                canEditItem={canEditContract()}
                                                            />
                                                        ))
                                                    }
                                                    {contractItem.specs.length > 0 &&
                                                        <TableRow>
                                                            <TableCell className={classes.footer_row} colSpan={5}>Итого
                                                                по контракту</TableCell>
                                                            <TableCell
                                                                className={classes.footer_row}>{getTotalSumDiscount(contractItem.specs)}</TableCell>
                                                            <TableCell
                                                                className={classes.footer_row}>{getTotalSpecSum(contractItem.specs)}</TableCell>
                                                            <Hidden only={['xs', 'sm']}>
                                                                <TableCell/>
                                                                <TableCell/>
                                                            </Hidden>
                                                        </TableRow>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </Fragment>
                                    )}
                            </Grid>
                            {contractId !== NEW_RECORD_VALUE &&
                                <Grid container spacing={1}>
                                    <Grid item xs={10} sm={10}>
                                        <TextField
                                            fullWidth
                                            disabled
                                            id="outlined-multiline-flexible"
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
                                            id="outlined-multiline-flexible"
                                            label="Дата"
                                            margin="dense"
                                            name="created"
                                            value={moment(contractItem.created).isValid() ? moment(contractItem.created).format('YYYY.MM.DD') : ''}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            }
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
                                onClickTableItem={handleClickTableItem}
                            />
                        </TabPanel>
                    </CardContent>
                    <Divider />
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
        </div>
    );
};

export default ContractItem;
