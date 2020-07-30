import React, {SyntheticEvent, useEffect, useState} from 'react'
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
    TextField, Typography
} from '@material-ui/core'
import { useHistory } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import {loadPayMethodItems} from "redux/actions/payMethodAction"
import {
    DIALOG_CANCEL_TEXT,
    DIALOG_SELECT_TEXT,
    NEW_RECORD_VALUE
} from "utils/AppConst"
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {useDialog} from "components/SelectDialog";
import {
    addNewPaymentItem,
    changePayment,
    loadPaymentItem, newPaymentByContract,
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
    const paymentId = paramId === 'new' ? NEW_RECORD_VALUE :parseInt(paramId)
    const query = new URLSearchParams(props.location.search);
    const querySource = query.get('source') || DEFAULT_SOURCE_PATH
    const querySourceId = query.get('id') || 0
    const queryContractId = parseInt(query.get('contractId') || '0')

    const { className } = props

    const [hasLoad, setLoad] = useState <boolean>(false)
    const paymentItem  = useSelector((state: IStateInterface)=> state.payment.paymentItem)
    const payMethodItems = useSelector((state:IStateInterface)=> state.payMethod.payMethodItems)
    const hasError = useSelector((state: IStateInterface) => state.payment.hasError)
    const contracts = useSelector((state: IStateInterface)=> state.contract.activeContracts)

    const [dataSource, setDataSource] = useState<IContractListItemSimple[]>([])
    const [inputValue, setInputValue] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...paymentItem, [event.target.name]: event.target.value}
        dispatch(changePayment(item))
    }

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        if (paymentId === NEW_RECORD_VALUE) {
            await dispatch(addNewPaymentItem(paymentItem));
        } else {
            await dispatch(updatePaymentItem(paymentItem));
        }
        resolve();
    })

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        event.preventDefault()
        saveItem(dispatch).then( ()=>{
                history.push('/payments/')
            }
        )
    }

    const closeHandler = (event: React.MouseEvent) => {
        if (querySource === CONTRACT_PATH_REDIRECT && querySourceId) {
            history.push(`/contract/${querySourceId}`)
        }else{
            history.push('/payments/')
        }
    }

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
                dispatch(newPaymentByContract(queryContractId))
            }else {
                dispatch(loadPaymentItem(paymentId))
            }
        }

        if (inputValue.length < 2) {
            return undefined
        }else{
            const newClients: IContractListItemSimple[] = [];
            dispatch(loadActiveContractsList(inputValue));
            contracts.forEach((value)=>{
                newClients.push(value);
            })
            setDataSource(newClients);
        }
    }, [dispatch, inputValue])

    //TODO Реализовать в виде отдельного компонента
    /**
     * Сменить метод оплаты
     */
    const handleChangeMethodPayment = () => {
        selectDialog(
            {
                'title': 'Выбор продукции',
                description: '.',
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

    function onChangeContract(event: object, value: IContractListItemSimple | null, reason: string) {
        console.log('onChangeClient', value)
        //setCurClient(value);
        if (value){
            const newState = {...paymentItem, 'contract': value}
            dispatch(changePayment(newState));
        }
    }

    return (
        <div className={classes.root}>
            <Card className={className}>
                <form autoComplete="off" noValidate onSubmit={saveHandler}>
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
                                        <TextField {...params} margin="dense" label="№ контракта/клиент" variant="outlined" fullWidth />
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
                                    name="name"
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
                                        label="Окончание процесса"
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
                                        //helperText={hasProductError ? "Обязательное поле" : ""}
                                        //error={hasProductError}
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
                                    name="calcValue"
                                    onChange={handleChange}
                                    required
                                    value={paymentItem.value}
                                    variant="outlined"
                                    inputProps={{
                                        readOnly: Boolean(!canEditRecord()),
                                        disabled: Boolean(!canEditRecord()),
                                    }}
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
