import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import {KeyboardDateTimePicker} from "@material-ui/pickers";
import {IProductionTeam} from "types/model/production";
import {updateTeamItem} from "redux/actions/productionAction";


const useStyles = makeStyles(theme => ({
    root: {
        //padding: theme.spacing(1)
    },
    content: {
        paddingTop: 150,
        textAlign: 'center'
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 560
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        //maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}));
interface IProductionTeamItemProps {
    item: IProductionTeam;
    onDeleteItem: ( (id: number)=> void);
    onChangeEmployeeItem: ( (id: number)=> void);
    onChangeWorkItem: ((id: number)=> void);
    canEdit: boolean;
}


const ProductionTeamItem = (props: IProductionTeamItemProps) => {
    const classes = useStyles();
    const { item, onDeleteItem, onChangeEmployeeItem, onChangeWorkItem, canEdit } = props;
    const dispatch = useDispatch();

    const handleClickListItem = (id: number) => {
        onChangeEmployeeItem(id)
    };

    const handleClickChangeWorkItem = (id: number) => {
        onChangeWorkItem(id)
    }

    const handleClickDeleteItem = (id: number)=> {
        onDeleteItem(id);
    };

    const handleDateChangeStartPeriod = (date: Date | null) => {
        try {
            const strDate = date?.toISOString().slice(0, 19);
            const teamItem = {...item, 'periodStart': strDate as string};
            dispatch(updateTeamItem(teamItem))
        }catch (e) {
            console.log(e.toString())
        }
    };

    const handleDateChangeEndPeriod = (date: Date | null) => {
        try {
            const strDate = date?.toISOString().slice(0, 19);
            const teamItem = {...item, 'periodEnd': strDate as string};
            dispatch(updateTeamItem(teamItem))
        }catch (e) {
            console.log(e.toString())
        }
    };

    return (
        <Fragment>
            <Grid item xs={4}>
                <Paper component="form" elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Сотрудник"
                        name="unit"
                        value={item.employee.fio}
                    />
                    {
                        canEdit ? (
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={event => {handleClickListItem(item.id)}}>
                                <MenuOpenIcon />
                            </IconButton>
                        ): (null)
                    }
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper component="form" elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Вид работы"
                        name="work"
                        value={item.work.name}
                    />
                    {
                        canEdit ? (
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {handleClickChangeWorkItem(item.id)}}>
                                <MenuOpenIcon />
                            </IconButton>
                        ): (null)
                    }
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <KeyboardDateTimePicker
                    disableToolbar
                    //inputVariant="standard"
                    showTodayButton={true}
                    format="dd/MM/yyyy HH:mm"
                    ampm={false}
                    id="periodStart"
                    label="Начало смены"
                    name="periodStart"
                    value={item.periodStart}
                    onChange={handleDateChangeStartPeriod}
                    readOnly={!canEdit}
                />
            </Grid>
            <Grid item xs={2}>
                <KeyboardDateTimePicker
                    disableToolbar
                    //inputVariant="standard"
                    format="dd/MM/yyyy hh:mm"
                    ampm={false}
                    id="periodEnd"
                    label="Окончание"
                    name="periodEnd"
                    value={item.periodEnd}
                    onChange={handleDateChangeEndPeriod}
                    readOnly={!canEdit}
                />
            </Grid>
            {canEdit ? (
                <Grid item>
                    <Tooltip title={'Удалить запись'}>
                        <Fab color="secondary" aria-label="add" onClick={event => handleClickDeleteItem(item.id)}>
                            <DeleteIcon/>
                        </Fab>
                    </Tooltip>
                </Grid>
            ) : (null)
            }
        </Fragment>
    );
};

export default ProductionTeamItem;
