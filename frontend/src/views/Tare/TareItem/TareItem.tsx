import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNewTare, changeTare, loadTareItem, updateTare } from "redux/actions/tareAction";
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import {loadUnit} from "redux/actions/unitAction";
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import Alert from '@material-ui/lab/Alert';
import {DIALOG_CANCEL_TEXT, DIALOG_SELECT_TEXT, NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";
import {useDialog} from "components/SelectDialog";
import {IStateInterface} from "../../../redux/rootReducer";


interface ITareItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    }
}));

const TareItem = (props: ITareItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const selectDialog = useDialog();

    const paramId = props.match.params.id;
    const tareId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const tareItem  = useSelector((state: any) => state.tare.tareItem);
    const errorValue = useSelector((state: IStateInterface) => state.tare.error);
    const hasError = useSelector((state: IStateInterface) => state.tare.hasError);
    const unitItems = useSelector((state: IStateInterface) => state.unit.unitItems);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        if (typeof (tareItem[event.target.name]) === 'number') {
            value = parseFloat(event.target.value);
        }else{
            value =  event.target.value;
        }
        const item = {...tareItem, [event.target.name]: value};
        dispatch(changeTare(item))
    };

    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (tareId === NEW_RECORD_VALUE) {
                await dispatch(addNewTare(tareItem));
            } else {
                await dispatch(updateTare(tareItem));
            }
            resolve();
        }catch (e) {
            reject()
        }
    });

     /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
         event.preventDefault()
        saveItem(dispatch).then( ()=>{
            history.push('/catalogs/tare');
        }
        ).catch(()=>{
            console.log('Error')
        }).finally(
            ()=>{
                console.log('saveHandler_end');
            }
        );
    };

    useEffect( ()=> {
            dispatch(loadTareItem(tareId));
            dispatch(loadUnit());
        }, [dispatch, tareId]
    );

    const handleClickListItem = () => {
        handleChangeUnit();
    };

    //TODO Реализовать в виде отдельного компонента
    /**
     * Сменить ед. измерения
     */
    const handleChangeUnit = () => {
        selectDialog(
            {
                title: 'Выбор единицы измерения',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: unitItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
            const item = {...tareItem};
            item.idUnit = value.id;
            item.unit = value.name;
            dispatch(changeTare(item))
            }
        );
    };


    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Упаковочная тара"
                    />
                    <Divider />
                    {hasError &&
                    <Paper elevation={0}>
                        <Alert severity="error">{errorValue}</Alert>
                    </Paper>
                    }

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Наименование"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={tareItem.name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    type={'number'}
                                    fullWidth
                                    label="Объём"
                                    margin="dense"
                                    name="v"
                                    onChange={handleChange}
                                    required
                                    value={tareItem.v}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={4}
                            >
                                <Paper component="form" elevation={0} className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        disabled={true}
                                        label="Ед. изм."
                                        margin="dense"
                                        name="unit"
                                        onChange={handleChange}
                                        required
                                        value={tareItem.unit}
                                        variant="outlined"
                                    />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                                onClick={handleClickListItem}>
                                        <MenuOpenIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>

                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            type={"submit"}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/catalogs/tare'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default TareItem;
