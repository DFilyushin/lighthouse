import React, {useEffect, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField,
    Paper,
    Typography
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {loadStoreItem} from "redux/actions/storeAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE, STORE_IN} from "utils/AppConst";
import moment from "moment";

interface IStoreItemProps {
    className: string;
    match: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    dividerInset: {
        margin: `5px 0 0 ${theme.spacing(9)}px`,
    },
}));

const StoreItem = (props: IStoreItemProps) => {
    const { className, ...rest } = props;

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const paramId = props.match.params.id;
    const id = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE : parseInt(paramId);
    const storeItem = useSelector((state: IStateInterface)=> state.store.storeJournalItem);

    useEffect(()=> {
        dispatch(loadStoreItem(id));
    }, [dispatch, id]);


    return (
        <div className={classes.root}>
            <Card
                {...rest}
                className={className}
            >
                <CardHeader
                    subheader={storeItem.type === STORE_IN ? 'Приход материала' : 'Расход материала'}
                    title="Запись движения материалов"
                />
                <CardContent>
                    <Paper className={classes.paper_bar}>

                    </Paper>
                        <form
                            autoComplete="off"
                            noValidate
                        >
                            <Divider />
                            <CardContent>
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Наименование"
                                            margin="dense"
                                            name="material"
                                            required
                                            value={storeItem.material.name}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={10}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Тара"
                                            margin="dense"
                                            name="tare"
                                            required
                                            value={storeItem.tare.name}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Объём"
                                            margin="dense"
                                            name="cost"
                                            required
                                            value={storeItem.tare.v}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={2} >
                                        <TextField
                                            fullWidth
                                            label="Дата операции"
                                            margin="dense"
                                            name="date"
                                            value={moment(storeItem.date).format('YYYY-MM-DD')}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <TextField
                                            fullWidth
                                            type={'number'}
                                            label="Кол-во"
                                            margin="dense"
                                            name="count"
                                            required
                                            value={storeItem.count}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2} >
                                        <TextField
                                            fullWidth
                                            type={'number'}
                                            label="Цена за единицу"
                                            margin="dense"
                                            name="price"
                                            required
                                            value={storeItem.price}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        >
                                        <Divider component="div" variant="inset" />
                                        <div>
                                            <Typography
                                                className={classes.dividerInset}
                                                color="textSecondary"
                                                display="block"
                                                variant="caption"
                                            >
                                                Дополнительно
                                            </Typography>
                                        </div>
                                    </Grid>
                                    {storeItem.costId &&
                                    <Fragment>
                                        <Grid
                                            item
                                            xs={8}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Статья затрат"
                                                margin="dense"
                                                name="cost"
                                                required
                                                value={storeItem.costId.cost}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Дата"
                                                margin="dense"
                                                name="cost"
                                                required
                                                value={storeItem.costId.date}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Сумма затрат"
                                                margin="dense"
                                                name="cost"
                                                required
                                                value={storeItem.costId.total}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Fragment>
                                    }
                                    {storeItem.factoryId &&
                                    <Fragment>
                                        <Grid
                                            item
                                            xs={10}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Производственная карта"
                                                margin="dense"
                                                name="cost"
                                                required
                                                value={ `№ ${storeItem.factory.id} на продукцию ${storeItem.factory.product}`}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Дата карты"
                                                margin="dense"
                                                name="cost"
                                                required
                                                value={moment(storeItem.factory.prodStart).format('YYYY-MM-DD HH:mm')}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Fragment>
                                    }
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <Divider />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={10}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Запись журнала создана"
                                            margin="dense"
                                            name="created"
                                            disabled
                                            value={storeItem.creator.fio}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Дата"
                                            margin="dense"
                                            name="created"
                                            disabled
                                            value={moment(storeItem.created).format('YYYY-MM-DD HH:mm')}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button
                                    color="default"
                                    variant="contained"
                                    onClick={(event => history.goBack())}
                                >
                                    Закрыть
                                </Button>
                            </CardActions>
                        </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StoreItem;
