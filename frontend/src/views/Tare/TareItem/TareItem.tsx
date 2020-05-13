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
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';


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
    const hasError = useSelector((state: any) => state.tare.hasError)

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
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.MouseEvent) => {
        if (tareId === 0) {
            dispatch(addNewTare(tareItem));
        } else {
            dispatch(updateTare(tareItem));
        }
        console.log(hasError);
        if (!hasError) history.push('/catalogs/tare');
    };

    useEffect( ()=> {
            if (tareId !== 0) dispatch(loadTareItem(tareId));
        }, [dispatch]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
                    <CardHeader
                        subheader=""
                        title="Упаковочная тара"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={12}
                            >
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
                            <Grid
                                item
                                xs={4}
                            >
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
                                <Paper component="form" className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        label="Объём"
                                        margin="dense"
                                        name="unit"
                                        onChange={handleChange}
                                        required
                                        value={tareItem.unit}
                                        variant="outlined"
                                    />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                                        <DirectionsIcon />
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
                            color="secondary"
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
