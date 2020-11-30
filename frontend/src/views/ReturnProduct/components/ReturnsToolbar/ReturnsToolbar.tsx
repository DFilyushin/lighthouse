import React, {useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Grid,
    Typography,
    ListItem,
    List,
    Avatar,
    ListItemAvatar,
    TextField
} from '@material-ui/core';
import { SearchInput } from 'components';
import {
    RETURN_PERIOD_END,
    RETURN_PERIOD_START
} from "types/Settings";
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';


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

interface IReturnsToolbar {
    className: string;
    onFind: any;
    onRefresh: (startDate: string, endDate: string) => void;
}

const ReturnsToolbar = (props: IReturnsToolbar) => {
    const classes = useStyles();
    const { className, onFind, onRefresh, ...rest } = props;
    const [firstDate, setFirstDate] = React.useState('')
    const [endDate, setEndDate] = React.useState('')

    const handleFirstDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstDate(event.target.value);
    };
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value)
    };


    /**
     * Запрос данных с сервера
     */
    const handleRefreshData = ()=> {
        localStorage.setItem(RETURN_PERIOD_START, firstDate);
        localStorage.setItem(RETURN_PERIOD_END, endDate);
        onRefresh(firstDate, endDate);
    };

    /**
     * Сохраненные данные начала и окончания периода
     */
    useEffect(()=>{
        const d1: string|null = localStorage.getItem(RETURN_PERIOD_START)
        const d2: string|null = localStorage.getItem(RETURN_PERIOD_END)
        if (d1) {setFirstDate((new Date(d1)).toISOString().slice(0,10))}
        if (d2) {setEndDate( (new Date(d2)).toISOString().slice(0,10))}
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

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> <Rotate90DegreesCcwIcon color={"primary"}/> </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Возвраты продукции</Typography>
                </ListItem>
            </List>
            <Grid
                container
                spacing={3}
            >

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
                                placeholder='Поиск по наименованию продукции'
                            />
                        </Grid>

                        <Grid
                            item
                            lg={2}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <TextField
                                id="datetime-local"
                                label="Начало"
                                type="date"
                                defaultValue={firstDate}
                                value={firstDate}
                                className={classes.formControl}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleFirstDateChange}
                            />
                        </Grid>

                            <Grid
                            item
                            lg={2}
                            sm={6}
                            md={6}
                            xs={12}
                            >
                            <TextField
                            id="datetime-local"
                            label="Окончание"
                            type="date"
                            defaultValue={endDate}
                            value={endDate}
                            className={classes.formControl}
                            InputLabelProps={{
                            shrink: true,
                        }}
                            onChange={handleEndDateChange}
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

export default ReturnsToolbar;
