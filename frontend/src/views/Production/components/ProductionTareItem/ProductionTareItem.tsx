import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import {IProductionTare} from "types/model/production";
import {updateTareItem} from "../../../../redux/actions/productionAction";
import Tooltip from "@material-ui/core/Tooltip";

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
interface IProductionTareItemProps {
    item: IProductionTare;
    onDeleteItem: ( (id: number)=> void);
    onChangeItem: ( (id: number)=> void);
}


const ProductionTareItem = (props: IProductionTareItemProps) => {
    const classes = useStyles();
    const { item, onDeleteItem, onChangeItem} = props;
    const dispatch = useDispatch();

    const handleClickListItem = (id: number) => {
        onChangeItem(id)
    };

    const handleClickDeleteItem = (id: number)=> {
        onDeleteItem(id);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: parseFloat(event.target.value)};
        dispatch(updateTareItem(newItem))
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
                        label="Упаковка"
                        name="raw"
                        value={item.tareName}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={event => {handleClickListItem(item.id)}}>
                        <MenuOpenIcon />
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Объём"
                    type={'number'}
                    name="tareV"
                    required
                    value={item.tareV}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Кол-во"
                    type={'number'}
                    name="count"
                    onChange={handleChange}
                    required
                    value={item.count}
                />
            </Grid>
            <Grid item>
                <Tooltip title={'Удалить запись'}>
                    <Fab color="secondary" aria-label="add" onClick={event => handleClickDeleteItem(item.id)}>
                        <DeleteIcon />
                    </Fab>
                </Tooltip>
            </Grid>
        </Fragment>
    );
};

export default ProductionTareItem;
