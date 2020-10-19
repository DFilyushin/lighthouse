import React, {SyntheticEvent, useEffect, useState} from 'react'
import { useHistory } from "react-router-dom"
import {RouteComponentProps} from "react-router"
import { makeStyles } from '@material-ui/core/styles'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    IconButton,
    TextField,
    Typography,
    Paper
} from '@material-ui/core'
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import {loadPayMethodItems} from "redux/actions/payMethodAction"
import {
    DIALOG_CANCEL_TEXT,
    DIALOG_SELECT_TEXT, NEW_RECORD_TEXT,
    NEW_RECORD_VALUE
} from "utils/AppConst"
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {useDialog} from "components/SelectDialog";
import {
    addNewPaymentItem,
    changePayment,
    loadPaymentItem,
    newPaymentByContract,
    updatePaymentItem
} from "redux/actions/paymentAction";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    loadActiveContractsList,
} from "redux/actions/contractAction";
import {IContractListItemSimple} from "types/model/contract";

const DEFAULT_SOURCE_PATH = 'payments'
const CONTRACT_PATH_REDIRECT = 'contract'

interface IPaymentItemProps extends RouteComponentProps{
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
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}))

const PaymentItem = (props: IPaymentItemProps) => {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const selectDialog = useDialog()

    const paramId = props.match.params.id
    const paymentId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId)
    const query = new URLSearchParams(props.location.search);
    const querySource = query.get('source') || DEFAULT_SOURCE_PATH
    const querySourceId = query.get('id') || 0
    const queryContractId = parseInt(query.get('contractId') || '0')

    const { className } = props

    const [hasLoad, setLoad] = useState <boolean>(false)
    const paymentItem  = useSelector((state: IStateInterface)=> state.payment.paymentItem)
    const payMethodItems = useSelector((state:IStateInterface)=> state.payMethod.payMethodItems)
    const contracts = useSelector((state: IStateInterface)=> state.contract.activeContracts)

    const [dataSource, setDataSource] = useState<IContractListItemSimple[]>([])
    const [inputValue, setInputValue] = useState('')
    const [hasTotalSumError, setTotalSumError] = useState(false)
    const [hasMethodError, setMethodError] = useState(false)
    const [hasContractError, setContractError] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...paymentItem, [event.target.name]: event.target.value}
        dispatch(changePayment(item))
    }

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try {
            if (paymentId === NEW_RECORD_VALUE) {
                await dispatch(addNewPaymentItem(paymentItem))
            } else {
                await dispatch(updatePaymentItem(paymentItem))
            }
            resolve()
        }catch (e) {
            reject()
        }
    })

    const redirectClose = () => {
        console.log('redirectClose')
        if (querySource === CONTRACT_PATH_REDIRECT && querySourceId) {
            history.push(`/contracts/${querySourceId}`)
        }else{
            history.push('/payments/')
        }
    }

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        event.preventDefault()
        if (isValid()) {
            saveItem(dispatch).then(() => {
                    redirectClose()
                }
            )
        }
    }

    /**
     * Возврат назад
     * @param event
     */
    const closeHandler = (event: React.MouseEvent) => {
        redirectClose()
    }

    /**
     * Проверка возможности редактирования таблицы
     */
    const canEditRecord = () => {
        return true
    }

    useEffect( ()=> {
            dispatch(loadPayMethodItems())
        }, [dispatch]
    )

    useEffect(()=>{
        if (!hasLoad) {
            setLoad(true)
            if (paymentId === NEW_RECORD_VALUE){
                if (queryContractId) dispatch(newPaymentByContract(queryContractId))
            }else {
                dispatch(loadPaymentItem(paymentId))
            }
        }

        if (inputValue.length < 2) {
            return undefined
        }else{

            dispatch(loadActiveContractsList(inputValue));
            const newClients: IContractListItemSimple[] = contracts.map(value => {return value})
            setDataSource(newClients);
        }
        // eslint-disable-next-line
    }, [dispatch, inputValue])

    //TODO Реализовать в виде отдельного компонента
    /**
     * Сменить метод оплаты
     */
    const handleChangeMethodPayment = () => {
        selectDialog(
            {
                title: 'Выбор метода оплат',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: payMethodItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...paymentItem, method: {id: value.id, name: value.name}}
                dispatch(changePayment(item))
            }
        );
    }

    const handleChangeDatePayment = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...paymentItem, 'date': strDate as string};
        dispatch(changePayment(item))
    }

    /**
     * Проверка валидности формы
     */
    function isValid() : boolean {
        const hasTotalSum = paymentItem.value === 0
        const hasMethod = paymentItem.method.id === 0
        const hasContract = paymentItem.contract.id === 0
        setContractError(hasContract)
        setMethodError(hasMethod)
        setTotalSumError(hasTotalSum)
        console.log(hasTotalSum,  hasMethod,  hasContract)
        return !hasTotalSum &&  !hasMethod && !hasContract
    }

    function onChangeContract(event: object, value: IContractListItemSimple | null, reason: string) {
        if (value){
            const newState = {...paymentItem, 'contract': value}
            dispatch(changePayment(newState));
        }
    }

    return (
        <div className={classes.root}>
            <Card className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Платёж по контракту"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Autocomplete
                                    autoComplete
                                    getOptionLabel={option => `${option.num} - ${option.client}` }
                                    options={dataSource as IContractListItemSimple[]}
                                    onChange={onChangeContract}
                                    value={paymentItem.contract}
                                    clearText={'Очистить'}
                                    renderOption={option => (
                                        <Grid container alignItems="center">
                                            <Grid item>
                                                {option.num}
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="body2" color="textSecondary">
                                                    &nbsp;&nbsp;{option.client}
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
                                            label="№ контракта/клиент"
                                            variant="outlined"
                                            fullWidth
                                            helperText={hasContractError ? "Обязательное поле" : ""}
                                            error={hasContractError}
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid
                                item
                                xs={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Номер документа"
                                    margin="dense"
                                    name="num"
                                    onChange={handleChange}
                                    required
                                    value={paymentItem.num}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={6}
                            >
                                    <KeyboardDatePicker
                                        disableToolbar
                                        inputVariant="outlined"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        id="date"
                                        label="Дата платежа"
                                        name="date"
                                        value={paymentItem.date}
                                        onChange={handleChangeDatePayment}
                                        readOnly={!canEditRecord()}
                                    />
                            </Grid>
                            <Grid item xs={12}>
                                <Paper  elevation={0} className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        label="Метод оплаты"
                                        margin="dense"
                                        name="product"
                                        onChange={handleChange}
                                        required
                                        value={paymentItem.method.name}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        helperText={hasMethodError ? "Обязательное поле" : ""}
                                        error={hasMethodError}
                                    />
                                    {canEditRecord() ? (
                                        <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeMethodPayment}>
                                            <MenuOpenIcon />
                                        </IconButton>
                                    ):null
                                    }
                                </Paper>
                            </Grid>
                            <Grid item xs={3} >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="Сумма, тнг"
                                    margin="dense"
                                    name="value"
                                    onChange={handleChange}
                                    required
                                    value={paymentItem.value}
                                    variant="outlined"
                                    inputProps={{
                                        readOnly: Boolean(!canEditRecord()),
                                        disabled: Boolean(!canEditRecord()),
                                    }}
                                    helperText={hasTotalSumError ? "Обязательное поле" : ""}
                                    error={hasTotalSumError}
                                />
                            </Grid>

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
                            onClick={closeHandler}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default PaymentItem;
