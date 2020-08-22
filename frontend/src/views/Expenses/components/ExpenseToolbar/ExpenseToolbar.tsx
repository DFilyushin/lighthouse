import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Grid,
    Typography,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    ListItem,
    ListItemAvatar,
    Avatar,
    List
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { KeyboardDatePicker} from '@material-ui/pickers';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import {ICostSimple} from "types/model/cost";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {setExpenseCost, setExpenseDateEnd, setExpenseDateStart} from "redux/actions/expenseAction";
import {INVALID_DATE_FORMAT} from "../../../../utils/AppConst";

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

interface IExpenseToolbar {
    className: string;
    newItemUrl: string;
    onDelete: any;
    costs: ICostSimple[];
    onRefresh: () => void;
}

const ExpenseToolbar = (props: IExpenseToolbar) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const dateStart = useSelector((state: IStateInterface) => state.expense.dateStart);
    const dateEnd = useSelector((state: IStateInterface) => state.expense.dateEnd);
    const costId = useSelector((state: IStateInterface) => state.expense.cost);

    const { className, newItemUrl, onDelete, costs, onRefresh, ...rest } = props;

    const handleFirstDateChange = (date: Date | null) => {
        const value = date ? date : (new Date())
        dispatch(setExpenseDateStart(value.toISOString().slice(0, 10)))
    };
    const handleEndDateChange = (date: Date | null) => {
        const value = date ? date : (new Date())
        dispatch(setExpenseDateEnd(value.toISOString().slice(0, 10)))
    };
    const handleChangeCost = (event: React.ChangeEvent<{ value: unknown }>)=>{
        dispatch(setExpenseCost(event.target.value as number));
    };

    /**
     * Запрос данных с сервера
     */
    const handleRefreshData = ()=> {
        onRefresh();
    };

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
                        <Avatar className={clsx(classes.large, classes.white)}> <AccountBalanceWalletOutlinedIcon color={"primary"}/> </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Затраты</Typography>
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
                        <span className={classes.spacer} />
                        <Button color="primary" variant="contained" onClick={onNewItemButtonHandler}>Добавить</Button>
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
                    <FormControl className={clsx(classes.formControl, classes.formControlWidth)}>
                        <InputLabel id="demo-simple-select-helper-label">Статья затрат</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={costId}
                            onChange={handleChangeCost}
                        >
                            <MenuItem key={-1} value={0}>
                                <em>не указано</em>
                            </MenuItem>
                            {
                                costs.map(item=>(
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
                        value={dateStart}
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
                        value={dateEnd}
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

export default ExpenseToolbar;
