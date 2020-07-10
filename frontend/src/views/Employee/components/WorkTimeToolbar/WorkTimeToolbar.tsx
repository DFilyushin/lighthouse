import React, {useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Grid} from '@material-ui/core';
import { KeyboardDatePicker} from '@material-ui/pickers';
import {PROD_PERIOD_END, PROD_PERIOD_START} from "types/Settings";
import {INVALID_DATE_FORMAT} from "utils/AppConst";


const useStyles = makeStyles(theme => ({
    root: {},
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    row: {
        //height: '42px',
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

interface IWorkTimeToolbarProps {
    className: string;
    onRefresh: (startDate: Date | null, endDate: Date | null) => void;
}

const WorkTimeToolbar = (props: IWorkTimeToolbarProps) => {
    const classes = useStyles();
    const { className, onRefresh, ...rest } = props;
    const [firstDate, setFirstDate] = React.useState<Date | null>(new Date());
    const [endDate, setEndDate] = React.useState<Date | null>(new Date());

    const handleFirstDateChange = (date: Date | null) => {
        setFirstDate(date);
    };
    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date)
    };


    /**
     * Запрос данных с сервера
     */
    const handleRefreshData = ()=> {
        onRefresh(firstDate, endDate);
    };

    /**
     * Сохраненные данные начала и окончания периода
     */
    useEffect(()=>{
        const d1: string|null = localStorage.getItem(PROD_PERIOD_START);
        const d2: string|null = localStorage.getItem(PROD_PERIOD_END);
        if (d1) {setFirstDate(new Date(d1))}
        if (d2) {setEndDate(new Date(d2))}
    }, []);


    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
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

export default WorkTimeToolbar;
