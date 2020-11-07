import React, {Fragment} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, TextField} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import {IStoreMaterialItem} from "types/model/store";
import {changeItemMovement} from "redux/actions/storeAction";

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

interface IStoreMovementItemProps {
    item: IStoreMaterialItem;
    onDeleteItem: ((id: number) => void);
    onChangeItemRaw: ((id: number) => void);
    onChangeItemTare: ((id: number) => void);
}


const StoreMovementItem = (props: IStoreMovementItemProps) => {
    const classes = useStyles();
    const {item, onDeleteItem, onChangeItemRaw, onChangeItemTare} = props;
    const dispatch = useDispatch();

    const handleClickListItem = (id: number) => {
        onChangeItemRaw(id)
    };

    const handleClickDeleteItem = (id: number) => {
        onDeleteItem(id);
    };

    const handleClickTareItem = (id: number) => {
        onChangeItemTare(id)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: parseFloat(event.target.value)};
        dispatch(changeItemMovement(item.id, newItem))
    };


    return (
        <Fragment>
            <Grid item xs={4}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Материал"
                        name="raw"
                        value={item.material.name}
                    />
                    <IconButton
                        color="primary"
                        className={classes.iconButton}
                        aria-label="directions"
                        onClick={event => {
                            handleClickListItem(item.id)
                        }}>
                        <MenuOpenIcon/>
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Тара"
                        name="tare"
                        value={item.tare.name}
                    />

                    <IconButton
                        color="primary"
                        className={classes.iconButton}
                        aria-label="directions"
                        onClick={event => {
                            handleClickTareItem(item.id)
                        }}>
                        <MenuOpenIcon/>
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={1}>
                <TextField
                    label="Объём"
                    type={'number'}
                    name="v"
                    value={item.tare.v}
                    inputProps={{
                        readOnly: true,
                        disabled: true,
                    }}
                />
            </Grid>
            <Grid item xs={1}>
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                    label="Ед.изм"
                    name="tare"
                    value={item.tare.unit}
                />
            </Grid>
            <Grid item xs={1}>
                <TextField
                    label="Кол-во"
                    type={'number'}
                    name="count"
                    onChange={handleChange}
                    required
                    value={item.count}
                />
            </Grid>
            <Grid item xs={1}>
                <TextField
                    label="Цена"
                    type={'number'}
                    name="price"
                    onChange={handleChange}
                    required
                    value={item.price}
                />
            </Grid>
            <Grid item xs={1}>
                <TextField
                    label="Итого"
                    type={'number'}
                    name="count"
                    value={item.count * item.tare.v * item.price}
                    inputProps={{
                        readOnly: true,
                        disabled: true,
                    }}
                />
            </Grid>
            <Grid item>
                <Tooltip title={'Удалить запись'}>
                    <Fab color="secondary" aria-label="add" onClick={event => handleClickDeleteItem(item.id)}>
                        <DeleteIcon/>
                    </Fab>
                </Tooltip>
            </Grid>
        </Fragment>
    );
};

export default StoreMovementItem;
