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
import SelectItemDialog from "components/SelectItemDialog";
import {loadUnit} from "redux/actions/unitAction";
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import Alert from '@material-ui/lab/Alert';


interface ITareItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper_root: {
        //padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        //width: 400,
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
    const paramId = props.match.params.id;
    const tareId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;


    const tareItem  = useSelector((state: any) => state.tare.tareItem);
    const errorValue = useSelector((state: any) => state.tare.error);
    const hasError = useSelector((state: any) => state.tare.hasError);
    const unitItems = useSelector((state: any) => state.unit.unitItems);


    const [open, setOpen] = React.useState(false);


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
            if (tareId === 0) {
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
    const saveHandler = (event: React.MouseEvent) => {
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
        }, [dispatch, tareId]
    );

    const handleClickListItem = () => {
        dispatch(loadUnit());
        setOpen(true);
    };

    /**
     * Обработка закрытия окна выбора ед. имерения
     * @param id Код записи
     * @param newValue Значение
     */
    const handleClose = (id?: number, newValue?: string) => {
        setOpen(false);
        if (newValue && id ) {
            const item = {...tareItem, 'unit': newValue, 'idUnit': id};
            dispatch(changeTare(item));
        }
    };

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
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
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleClickListItem}>
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
                            onClick={saveHandler}
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
            {tareItem.id === tareId && <SelectItemDialog
                classes={{
                    paper: classes.paper
                }}
                title={'Выбор единицы измерения'}
                id="ringtone-menu"
                keepMounted
                open={open}
                onClose={handleClose}
                nameValue={tareItem.unit}
                records={unitItems}
                idField={'id'}
                valueField={'name'}
                keyValue={tareItem.idUnit}
            />}
        </div>
    );
};

export default TareItem;
