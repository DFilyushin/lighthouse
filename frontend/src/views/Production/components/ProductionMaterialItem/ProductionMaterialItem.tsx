import React, {Fragment} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, TextField, Paper, IconButton, Fab, Tooltip} from '@material-ui/core';
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import {IProductionMaterial} from "types/model/production";
import {updateMaterialItem} from "../../../../redux/actions/productionAction";
import {SELECT_PRODUCT, SELECT_STOCK} from "../../../../utils/AppConst";

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


interface IProductionTareItemProps {
    item: IProductionMaterial;
    onDeleteItem: ((id: number) => void);
    onChangeItem: ((id: number, typeSelect: number) => void);
    canEdit: boolean;
}


const ProductionMaterialItem = (props: IProductionTareItemProps) => {
    const classes = useStyles();
    const {item, onDeleteItem, onChangeItem, canEdit} = props;
    const dispatch = useDispatch();

    const handleClickListItem = (id: number, typeSelect: number) => {
        onChangeItem(id, typeSelect)
    }

    const handleClickDeleteItem = (id: number) => {
        onDeleteItem(id);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: parseFloat(event.target.value)};
        dispatch(updateMaterialItem(newItem))
    }


    return (
        <Fragment>
            <Grid item xs={10}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Материал"
                        name="material"
                        value={item.materialName}
                    />
                    {
                        canEdit ? (
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {
                                            handleClickListItem(item.id, SELECT_STOCK)
                                        }}>
                                <Tooltip title={"Выбрать ТМЦ"}>
                                    <MenuOpenIcon/>
                                </Tooltip>
                            </IconButton>
                        ) : null
                    }
                    {
                        canEdit ? (
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {
                                            handleClickListItem(item.id, SELECT_PRODUCT)
                                        }}>
                                <Tooltip title={"Выбрать продукцию"}>
                                    <MenuOpenIcon/>
                                </Tooltip>
                            </IconButton>
                        ) : null
                    }
                </Paper>
            </Grid>
            <Grid item xs={1}>
                <TextField
                    label="Кол-во"
                    type={'number'}
                    name="total"
                    onChange={handleChange}
                    required
                    value={item.total}
                    inputProps={{
                        readOnly: Boolean(!canEdit),
                        disabled: Boolean(!canEdit),
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
                ) : null
            }
        </Fragment>
    )
}

export default ProductionMaterialItem
