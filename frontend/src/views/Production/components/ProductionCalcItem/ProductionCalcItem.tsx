import React, {Fragment} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, TextField, Paper, IconButton, Tooltip, Fab} from '@material-ui/core';
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import {IProductionCalc} from "types/model/production";
import {updateCalcItem} from "../../../../redux/actions/productionAction";

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
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}));

interface IProductionTeamItemProps {
    item: IProductionCalc;
    onDeleteItem: ((id: number) => void);
    onChangeMaterialItem?: ((id: number, typeSelect: number) => void);
    onChangeUnitItem: ((id: number) => void);
    canEdit: boolean;
    canDelete: boolean;
}


const ProductionCalcItem = (props: IProductionTeamItemProps) => {
    const classes = useStyles();
    const {item, onDeleteItem, canEdit, canDelete, onChangeMaterialItem, onChangeUnitItem} = props;
    const dispatch = useDispatch();

    const handleClickListItem = (id: number, typeSelect: number) => {
        if (onChangeMaterialItem) {
            onChangeMaterialItem(id, typeSelect)
        }
    }

    const handleClickSelectUnit = (id: number) => {
        onChangeUnitItem(id)
    }

    const handleClickDeleteItem = (id: number) => {
        onDeleteItem(id);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: parseFloat(event.target.value)};
        dispatch(updateCalcItem(newItem))
    }


    return (
        <Fragment>
            <Grid item xs={7}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Материал"
                        name="raw"
                        value={item.raw.name}
                    />
                    {canEdit &&
                    <>
                        <Tooltip title={'Выбрать сырьё'}>
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {
                                            handleClickListItem(item.id, 0)
                                        }}>
                                <MenuOpenIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={'Выбрать продукцию'}>
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {
                                            handleClickListItem(item.id, 1)
                                        }}>
                                <MenuOpenIcon/>
                            </IconButton>
                        </Tooltip>
                    </>
                    }
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Ед. изм."
                        name="unit"
                        value={item.unit.name}
                    />
                    {canEdit &&
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                onClick={event => {
                                    handleClickSelectUnit(item.id)
                                }}>
                        <MenuOpenIcon/>
                    </IconButton>
                    }
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Кол-во"
                    type={'number'}
                    name="calcValue"
                    onChange={handleChange}
                    required
                    value={item.calcValue}
                />
            </Grid>
            {canDelete &&
            <Grid item>
                <Tooltip title={'Удалить запись'}>
                    <Fab color="secondary" aria-label="add" onClick={event => handleClickDeleteItem(item.id)}>
                        <DeleteIcon/>
                    </Fab>
                </Tooltip>
            </Grid>
            }
        </Fragment>
    );
};

export default ProductionCalcItem;
