import React, {useEffect} from 'react';
import moment from "moment";
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
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {
    loadEmployeeItem
} from "redux/actions/employeeAction";
import {useDialog} from "components/SelectDialog";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {DIALOG_CANCEL_TEXT, DIALOG_SELECT_TEXT} from "utils/AppConst";
import {loadStoreItem} from "../../../redux/actions/storeAction";
import {DatePicker} from "@material-ui/pickers";
import {changeProductionCard} from "../../../redux/actions/productionAction";

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
    }
}));

const StoreItem = (props: IStoreItemProps) => {
    const { className, ...rest } = props;

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const selectDialog = useDialog();

    const paramId = props.match.params.id;
    const id = paramId === 'new' ? 0 :parseInt(paramId);
    const storeItem = useSelector((state: IStateInterface)=> state.store.storeJournalItem);
    const staffItems = useSelector((state:IStateInterface)=> state.staff.staffs);
    const hasError = useSelector((state: IStateInterface)=> state.employee.hasError);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...storeItem, [event.target.name]: event.target.value};
        //dispatch(changeEmployeeItem(item))
    };

    /**
     * Сохранение изменений
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        // do anything here
        // if (id === 0) {
        //     await dispatch(addNewEmployeeItem(storeItem));
        // } else {
        //     await dispatch(updateEmployeeItem(storeItem));
        // }
        // resolve();
    });

    const saveHandler = (event: React.MouseEvent) => {
        saveItem(dispatch).then( ()=>{
                console.log('state', hasError);
                history.push('/org/employee');
            }
        );
    };

    const handleDateChangeStoreDate = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...storeItem, 'date': strDate as string};
        //dispatch(changeProductionCard(item))
    }

    const handleChangeStaff =  (event: React.MouseEvent) => {
        // selectDialog(
        //     {
        //         'title': 'Выбор должности',
        //         description: '.',
        //         confirmationText: DIALOG_SELECT_TEXT,
        //         cancellationText: DIALOG_CANCEL_TEXT,
        //         dataItems: staffItems,
        //         initKey: storeItem.staff.id,
        //         valueName: 'name'
        //     }
        // ).then((value:any) => {
        //         const item = {...storeItem};
        //         item.staff.id = value.id;
        //         item.staff.name = value.name;
        //         dispatch(changeEmployeeItem(item));
        //     }
        // );
    };

    useEffect(()=> {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    subheader=""
                    title="..."
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
                                            label="Наименование материала"
                                            margin="dense"
                                            name="tabNum"
                                            onChange={handleChange}
                                            required
                                            value={storeItem.material.name}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Тара"
                                            margin="dense"
                                            name="tare"
                                            onChange={handleChange}
                                            required
                                            value={storeItem.tare.name}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <DatePicker
                                            disableToolbar
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy"
                                            id="date"
                                            label="Дата операции"
                                            name="date"
                                            required
                                            margin="dense"
                                            value={storeItem.date}
                                            onChange={handleDateChangeStoreDate}
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <TextField
                                            fullWidth
                                            type={'number'}
                                            label="Кол-во"
                                            margin="dense"
                                            name="count"
                                            onChange={handleChange}
                                            required
                                            value={storeItem.count}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={3} >
                                        <TextField
                                            fullWidth
                                            type={'number'}
                                            label="Цена за единицу"
                                            margin="dense"
                                            name="price"
                                            onChange={handleChange}
                                            required
                                            value={storeItem.price}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Создана"
                                            margin="dense"
                                            name="tabNum"
                                            onChange={handleChange}
                                            disabled
                                            value={storeItem.employee.fio}
                                            variant="outlined"
                                        />
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
                                    type={"submit"}
                                >
                                    Отменить
                                </Button>
                            </CardActions>
                        </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StoreItem;
