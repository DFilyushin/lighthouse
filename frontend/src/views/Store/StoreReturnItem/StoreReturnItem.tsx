import React, {useEffect} from 'react';
import moment from "moment";
import {makeStyles} from '@material-ui/core/styles';
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
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    addReserveItem,
    changeReserveItem,
    getStoreReturnItem,
    updateReserveItem
} from "redux/actions/storeAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";
import {RouteComponentProps} from "react-router";

interface IStoreReturnItemProps extends RouteComponentProps {
    className: string;
    match: any;
    dialogStyle?: boolean;
    closeHandle?: any;
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

const StoreReturnItem = (props: IStoreReturnItemProps) => {
    const {className, ...rest} = props;

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    let querySource: string = ''
    if (props.location) {
        const query = new URLSearchParams(props.location.search);
        querySource = query.get('source') || 'reserve'
    }

    const paramId = props.match ? props.match.params.id : NEW_RECORD_TEXT;
    const id = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE : parseInt(paramId);
    const storeReturnItem = useSelector((state: any) => state.store.storeReturnItem);


    useEffect(() => {
        if (id !== NEW_RECORD_VALUE) {
            dispatch(getStoreReturnItem(id))
        }
    }, [dispatch, id]);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        if (typeof (storeReturnItem[event.target.name]) === 'number') {
            value = parseFloat(event.target.value);
        } else {
            value = event.target.value;
        }
        const item = {...storeReturnItem, [event.target.name]: value};
        dispatch(changeReserveItem(item))
    }

    const handleClose = (event: React.SyntheticEvent) => {
        if (rest.closeHandle) {
            rest.closeHandle()
        }
        if (querySource === 'reserve') {
            history.push('/return/')
        }
    }

    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        try {
            if (id === NEW_RECORD_VALUE) {
                await dispatch(addReserveItem());
            } else {
                await dispatch(updateReserveItem());
            }
            resolve();
        } catch (e) {
            reject()
        }
    });

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        event.preventDefault();
        saveItem(dispatch).then(() => {
                handleClose(event)
            }
        ).catch(() => {
            console.log('Error')
        }).finally(
            () => {
                console.log('saveHandler_end');
            }
        );
    };


    return (
        <div className={classes.root}>
            <Card
                {...rest}
                className={className}
            >
                <CardHeader
                    title="Возврат продукции"
                    subheader="Возврат продукции"
                />
                <CardContent>
                    <form
                        autoComplete="off"
                        onSubmit={saveHandler}
                    >
                        <Divider/>
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
                                        label="Клиент"
                                        margin="dense"
                                        name="material"
                                        required
                                        value={storeReturnItem.contract.client}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                >
                                    <TextField
                                        fullWidth
                                        label="Номер контракта"
                                        margin="dense"
                                        name="material"
                                        required
                                        value={storeReturnItem.contract.num}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                >
                                    <TextField
                                        fullWidth
                                        label="Дата"
                                        margin="dense"
                                        name="material"
                                        required
                                        value={storeReturnItem.contract.date}
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
                                    <TextField
                                        fullWidth
                                        label="Наименование"
                                        margin="dense"
                                        name="material"
                                        required
                                        value={storeReturnItem.product.name}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={5}
                                >
                                    <TextField
                                        fullWidth
                                        label="Тара"
                                        margin="dense"
                                        name="tare"
                                        required
                                        value={storeReturnItem.tare.name}
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
                                        value={storeReturnItem.tare.v}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        type={'number'}
                                        label="Кол-во в таре"
                                        margin="dense"
                                        name="value"
                                        required
                                        value={storeReturnItem.count}
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        type={'number'}
                                        label={`Кол-во в ${ storeReturnItem.tare.unit}`}
                                        margin="dense"
                                        name="value"
                                        required
                                        value={storeReturnItem.total}
                                        variant="outlined"
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Дата возврата"
                                        margin="dense"
                                        name="start"
                                        value={moment(storeReturnItem.date).format('YYYY-MM-DD')}
                                        variant="outlined"
                                        type={"date"}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider/>
                        {!rest.dialogStyle &&
                        <CardActions>
                            <Button
                                color="default"
                                variant="contained"
                                onClick={handleClose}
                            >
                                Закрыть
                            </Button>
                        </CardActions>
                        }
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StoreReturnItem;
