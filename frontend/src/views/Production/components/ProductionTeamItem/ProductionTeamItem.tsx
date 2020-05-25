import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import {IProductionTeam} from "../../../../types/model/production";
import {updateTeamItem} from "../../../../redux/actions/productionAction";
import {KeyboardDateTimePicker} from "@material-ui/pickers";

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
    onChangeItem: ( (id: number)=> void);
}


const ProductionTeamItem = (props: IProductionTeamItemProps) => {
    const classes = useStyles();
    const { item, onDeleteItem, onChangeItem } = props;
    const dispatch = useDispatch();

    const handleClickListItem = (id: number) => {
        onChangeItem(id)
    };

    const handleClickDeleteItem = (id: number)=> {
        onDeleteItem(id);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: parseFloat(event.target.value)};
        dispatch(updateTeamItem(newItem))
    };

    const handleDateChangeStartPeriod = (date: Date | null) => {
        console.log(date);
        const strDate = date?.toISOString().slice(0, 19);
        const teamItem = {...item, 'periodStart': strDate as string};
        dispatch(updateTeamItem(teamItem))
    };

    const handleDateChangeEndPeriod = (date: Date | null) => {
        console.log(date);
        const strDate = date?.toISOString().slice(0, 19);
        const teamItem = {...item, 'periodEnd': strDate as string};
        dispatch(updateTeamItem(teamItem))
    };

    return (
        <Fragment>
            <Grid item xs={7}>
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
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={event => {handleClickListItem(item.id)}}>
                        <MenuOpenIcon />
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <KeyboardDateTimePicker
                    disableToolbar
                    //inputVariant="standard"
                    format="dd/MM/yyyy hh:mm"
                    ampm={false}
                    id="date-picker-inline"
                    label="Начало смены"
                    name="periodEnd"
                    value={item.periodStart}
                    onChange={handleDateChangeStartPeriod}
                />
            </Grid>
            <Grid item xs={2}>
                <KeyboardDateTimePicker
                    disableToolbar
                    //inputVariant="standard"
                    format="dd/MM/yyyy hh:mm"
                    ampm={false}
                    id="date-picker-inline"
                    label="Окончание"
                    name="periodEnd"
                    value={item.periodEnd}
                    onChange={handleDateChangeEndPeriod}
                />
            </Grid>
            <Grid item>
                <Fab color="secondary" aria-label="add" onClick={event => handleClickDeleteItem(item.id)}>
                    <DeleteIcon />
                </Fab>
            </Grid>
        </Fragment>
    );
};

export default ProductionTeamItem;
