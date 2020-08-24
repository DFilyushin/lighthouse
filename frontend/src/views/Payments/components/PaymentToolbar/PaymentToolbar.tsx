import React, {useEffect} from 'react'
import clsx from 'clsx'
import { SearchInput } from 'components'
import { useHistory } from "react-router-dom"
import { KeyboardDatePicker} from '@material-ui/pickers'
import {
    makeStyles,
    Select,
    List,
    Avatar,
    ListItem,
    ListItemAvatar,
    FormControl,
    MenuItem,
    InputLabel,
    Button,
    Grid,
    Typography
} from '@material-ui/core'
import {PAYMENT_PERIOD_END, PAYMENT_PERIOD_START} from "types/Settings"
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import {INVALID_DATE_FORMAT} from "utils/AppConst"
import {IPayMethod} from "types/model/paymethod"


const useStyles = makeStyles(theme => ({
    root: {},
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        margin: theme.spacing(1),
    },
    spacer: {
        flexGrow: 1
    },
    importButton: {
        marginRight: theme.spacing(1)
    },
    exportButton: {
        marginRight: theme.spacing(1)
    },
    searchInput: {
        marginRight: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
    },
    formControlWidth: {
        minWidth: 250
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    white: {
        color: theme.palette.grey["100"],
        backgroundColor: theme.palette.background.default
    }
}));

interface IPaymentToolbarProps {
    className: string;
    newItemUrl: string;
    onFind: any;
    onDelete: any;
    methods: IPayMethod[];
    onRefresh: (startDate: Date | null, endDate: Date | null, method?: number) => void;
}

const PaymentToolbar = (props: IPaymentToolbarProps) => {
    const classes = useStyles()
    const history = useHistory()
    const { className, newItemUrl, onFind, onDelete, methods, onRefresh, ...rest } = props
    const [firstDate, setFirstDate] = React.useState<Date | null>(new Date())
    const [endDate, setEndDate] = React.useState<Date | null>(new Date())
    const [method, setMethod] = React.useState<number>(0)

    const handleFirstDateChange = (date: Date | null) => {
        setFirstDate(date)
    }
    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date)
    }

    const handleChangeProduct = (event: React.ChangeEvent<{ value: unknown }>)=>{
        setMethod(event.target.value as number);
    }

    /**
     * Запрос данных с сервера
     */
    const handleRefreshData = ()=> {
        onRefresh(firstDate, endDate, method);
    }

    /**
     * Сохраненные данные начала и окончания периода
     */
    useEffect(()=>{
        const d1: string|null = localStorage.getItem(PAYMENT_PERIOD_START)
        const d2: string|null = localStorage.getItem(PAYMENT_PERIOD_END)
        if (d1) {setFirstDate(new Date(d1))}
        if (d2) {setEndDate(new Date(d2))}
    }, []);

    /**
     * Поиск по Enter
     * @param event
     */
    function onKeyDownHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    /**
     * Новая производственная карта
     */
    function onNewItemButtonHandler() {
        history.push(newItemUrl);
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> <AccountBalanceIcon color={"primary"}/> </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Платежи</Typography>
                </ListItem>
            </List>
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xs={12}
                >
                <div className={classes.buttonGroup}>
                    <Button color="primary" variant="contained" onClick={onNewItemButtonHandler}>Новый платёж</Button>
                    <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
                </div>
                </Grid>
            </Grid>
                    <Grid
                        container
                        spacing={3}
                        className={classes.row}
                    >
                        <Grid
                            item
                            lg={3}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <SearchInput
                                className={classes.searchInput}
                                onEnterKeyDown={onKeyDownHandler}
                                placeholder='Поиск по номеру контракта'
                            />
                        </Grid>
                        <Grid
                            item
                            lg={2}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <FormControl className={clsx(classes.formControl)}>
                                <InputLabel id="select-payment-method-label">Метод оплаты</InputLabel>
                                <Select
                                    labelId="select-payment-method-label"
                                    id="demo-simple-select-helper"
                                    value={method}
                                    onChange={handleChangeProduct}
                                >
                                    <MenuItem key={-1} value={0}>
                                        <em>не указано</em>
                                    </MenuItem>
                                    {
                                        methods.map(item=>(
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid
                            item
                            lg={2}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <KeyboardDatePicker
                                className={classes.formControl}
                                id="start_date-picker-dialog"
                                label="Начало периода"
                                format="dd/MM/yyyy"
                                value={firstDate}
                                onChange={handleFirstDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                invalidDateMessage={INVALID_DATE_FORMAT}
                            />
                        </Grid>
                        <Grid
                            item
                            lg={2}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <KeyboardDatePicker
                                className={classes.formControl}
                                id="end_date-picker-dialog"
                                label="Окончание периода"
                                format="dd/MM/yyyy"
                                value={endDate}
                                onChange={handleEndDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                invalidDateMessage={INVALID_DATE_FORMAT}
                            />
                        </Grid>
                        <Grid
                            item
                            lg={2}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <Button variant="contained" onClick={handleRefreshData}>
                                Обновить
                            </Button>

                        </Grid>
                    </Grid>

        </div>
    );
};

export default PaymentToolbar;
