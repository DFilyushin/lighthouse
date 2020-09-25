import React, {Fragment} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, TextField, Paper, IconButton, Fab, Tooltip} from '@material-ui/core';
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import {IProductionTare} from "types/model/production";
import {updateTareItem} from "../../../../redux/actions/productionAction";

const useStyles = makeStyles(theme => ({
    root: {},
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
    onDeleteItem: ((id: number) => void);
    onChangeItem: ((id: number) => void);
    canEdit: boolean;
}


const ProductionTareItem = (props: IProductionTareItemProps) => {
    const classes = useStyles();
    const {item, onDeleteItem, onChangeItem, canEdit} = props;
    const dispatch = useDispatch();

    const handleClickListItem = (id: number) => {
        onChangeItem(id)
    };

    const handleClickDeleteItem = (id: number) => {
        onDeleteItem(id);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: parseFloat(event.target.value)};
        dispatch(updateTareItem(newItem))
    };


    return (
        <Fragment>
            <Grid item xs={5}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Упаковка"
                        name="raw"
                        value={item.tareName}
                    />
                    {
                        canEdit ? (
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {
                                            handleClickListItem(item.id)
                                        }}>
                                <MenuOpenIcon/>
                            </IconButton>
                        ) : null
                    }
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Объём"
                    type={'number'}
                    name="tareV"
                    required
                    value={item.tareV}
                    inputProps={{
                        readOnly: true,
                        disabled: true,
                    }}
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
                    inputProps={{
                        readOnly: Boolean(!canEdit),
                        disabled: Boolean(!canEdit),
                    }}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Итого"
                    type={'number'}
                    name="count"
                    value={item.count * item.tareV}
                    inputProps={{
                        readOnly: true,
                        disabled: true,
                    }}
                />
            </Grid>
            {
                canEdit ? (
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

export default ProductionTareItem;
