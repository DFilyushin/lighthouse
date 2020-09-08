import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import {updateRawItem} from "redux/actions/formulaAction";
import {IRawInFormula} from "types/model/formula";
import {useDispatch} from "react-redux";

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
interface IFormulaRawItemProps {
    item: IRawInFormula;
    onDeleteItem: ( (id: number)=> void);
    onChangeRawItem: ( (id: number)=> void);
    onChangeUnitItem: ((id: number)=> void);
}


const FormulaRawItem = (props: IFormulaRawItemProps) => {
    const classes = useStyles();
    const { item, onDeleteItem, onChangeRawItem, onChangeUnitItem} = props;
    const dispatch = useDispatch();

    /**
     * Смена сырья
     * @param id Код записи
     */
    const handleClickRawItem = (id: number) => {
        onChangeRawItem(id)
    }

    const handleClickUnitItem = (id: number) => {
        onChangeUnitItem(id)
    }

    const handleClickDeleteItem = (id: number)=> {
        onDeleteItem(id);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: parseFloat(event.target.value)};
        dispatch(updateRawItem(newItem))
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
                        label="Наименование сырья"
                        margin="dense"
                        name="unit"
                        value={item.raw.name}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={event => {handleClickRawItem(item.id)}}>
                        <MenuOpenIcon />
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Единица измерения"
                        margin="dense"
                        name="unit"
                        value={item.unit.name}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={event => {handleClickUnitItem(item.id)}}>
                        <MenuOpenIcon />
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Концентрация, %"
                    type={'number'}
                    margin="dense"
                    name="concentration"
                    onChange={handleChange}
                    required
                    value={item.concentration}
                />
            </Grid>

            <Grid item xs={1}>
                <TextField
                    label="Содержание, г/кг"
                    type={'number'}
                    margin="dense"
                    name="substance"
                    onChange={handleChange}
                    required
                    value={item.substance}
                />
            </Grid>
            <Grid item xs={1}>
                <TextField
                    label="Кол-во"
                    type={'number'}
                    margin="dense"
                    name="raw_value"
                    onChange={handleChange}
                    required
                    value={item.raw_value}
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

export default FormulaRawItem;
