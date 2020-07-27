import React, {useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Grid, Typography, Select, MenuItem} from '@material-ui/core';
import { KeyboardDatePicker} from '@material-ui/pickers';
import {STORE_PERIOD_END, STORE_PERIOD_START} from "types/Settings";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import {INVALID_DATE_FORMAT, NO_SELECT_VALUE} from "utils/AppConst";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxes } from '@fortawesome/free-solid-svg-icons'
import {useHistory} from "react-router-dom";

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
        //color: theme.palette.grey["100"],
        backgroundColor: 'white'
    },
    smallIcon: {
        height:'32px',
        width: '32px'
    },
    primaryColor: {
        color: theme.palette.primary.main
    }
}));

interface IStoreJournalToolbarProps {
    className: string;
    newItemUrl: string;
    onRefresh: (startDate: string, endDate: string, state: number, material: number) => void;
}

const StoreJournalToolbar = (props: IStoreJournalToolbarProps) => {
    const classes = useStyles()
    const history = useHistory()
    const { className, newItemUrl, onRefresh, ...rest } = props
    const [firstDate, setFirstDate] = React.useState<Date>(new Date())
    const [endDate, setEndDate] = React.useState<Date>(new Date())
    const [typeOperation, setTypeOperation] = React.useState<number>(NO_SELECT_VALUE)
    const [typeMaterial, setTypeMaterial] = React.useState<number>(NO_SELECT_VALUE)


    const handleFirstDateChange = (date: Date | null) => {
        if (date) setFirstDate(date);
    }

    const handleEndDateChange = (date: Date | null) => {
        if (date) setEndDate(date)
    }

    const handleChangeTypeOper = (event: React.ChangeEvent<{ value: unknown }>)=> {
        setTypeOperation(event.target.value as number)
    }

    const handleChangeTypeMaterial = (event: React.ChangeEvent<{ value: unknown}>) => {
        setTypeMaterial(event.target.value as number)
    }

    /**
     * Запрос данных с сервера
     */
    const handleRefreshData = ()=> {
        onRefresh(firstDate.toISOString(), endDate.toISOString(), typeOperation, typeMaterial);
    }


    /**
     * Сохраненные данные начала и окончания периода
     */
    useEffect(()=>{
        const d1: string|null = localStorage.getItem(STORE_PERIOD_START);
        const d2: string|null = localStorage.getItem(STORE_PERIOD_END);
        if (d1) {setFirstDate(new Date(d1))}
        if (d2) {setEndDate(new Date(d2))}
    }, []);

    /**
     * Новая запись
     */
    function onNewItemButtonHandler() {
        history.push('/store/raw/new')
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> <FontAwesomeIcon icon={faBoxes} className={classes.primaryColor} size={"lg"}/> </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Журнал операций</Typography>
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
                        <Button color="primary" variant="contained" onClick={onNewItemButtonHandler}>Приход сырья</Button>
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
                    lg={2}
                    sm={6}
                    md={6}
                    xs={12}
                >
                    <FormControl className={clsx(classes.formControl, classes.formControlWidth)}>
                        <InputLabel id="oper-type-label">Тип операции</InputLabel>
                        <Select
                            labelId="oper-type-label"
                            id="demo-simple-select-helper"
                            value={typeOperation}
                            onChange={handleChangeTypeOper}
                        >
                            <MenuItem value={NO_SELECT_VALUE}><em>не указано</em></MenuItem>
                            <MenuItem value={0}>Приход</MenuItem>
                            <MenuItem value={1}>Расход</MenuItem>
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
                    <FormControl className={clsx(classes.formControl, classes.formControlWidth)}>
                        <InputLabel id="oper-type-label">Тип материала</InputLabel>
                        <Select
                            labelId="oper-type-label"
                            id="demo-simple-select-helper"
                            value={typeMaterial}
                            onChange={handleChangeTypeMaterial}
                        >
                            <MenuItem value={NO_SELECT_VALUE}><em>не указано</em></MenuItem>
                            <MenuItem value={1}>Сырьё</MenuItem>
                            <MenuItem value={2}>Продукт</MenuItem>
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

export default StoreJournalToolbar;
