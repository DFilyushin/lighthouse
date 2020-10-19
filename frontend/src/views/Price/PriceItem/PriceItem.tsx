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
    TextField, Paper, IconButton
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";
import {changePriceItem, loadPriceListById, newPriceList, updatePrice} from "../../../redux/actions/priceAction";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {useDialog} from "../../../components/SelectDialog";
import {ITare} from "../../../types/model/tare";


interface IPriceItemProps {
    className: string;
    match: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    iconButton: {
        padding: 10,
    },
}));

const PriceItem = (props: IPriceItemProps) => {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const selectDialog = useDialog()

    const paramId = props.match.params.id;
    const priceId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;
    const productItems = useSelector((state: IStateInterface) => state.product.products)
    const tareItems = useSelector((state: IStateInterface)=> state.tare.tareItems)
    const employeeItems = useSelector((state: IStateInterface)=> state.employee.employeeItems)
    const priceItem  = useSelector((state: IStateInterface)=> state.price.priceItem)


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...priceItem, [event.target.name]: event.target.value};
        dispatch(changePriceItem(newItem))
    };

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (priceId === NEW_RECORD_VALUE) {
                dispatch(newPriceList(priceItem));
            } else {
                await dispatch(updatePrice(priceItem));
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
        event.preventDefault();
        saveItem(dispatch).then( ()=>{
            history.push('/price/');
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
        dispatch(loadPriceListById(priceId))
    }, [dispatch, priceId]
    )

    /**
     * Сменить продукцию
     */
    const handleChangeProduct = () => {
        selectDialog(
            {
                title: 'Выбор продукции',
                description: '',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: productItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...priceItem};
                item.productId = value.id;
                item.productName = value.name;
                dispatch(changePriceItem(item));
            }
        )
    }

    /**
     * Сменить продукцию
     */
    const handleChangeTare = () => {
        selectDialog(
            {
                title: 'Выбор тары',
                description: '',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: tareItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
            const item = {...priceItem};
            item.tareId = value.id;
            item.tareName = value.name;
            const tareIndex = tareItems.findIndex((elem: ITare)=>{return elem.id === value.id});
            item.tareV = tareItems[tareIndex].v
                dispatch(changePriceItem(item));
            }
        )
    }

    const handleChangeEmployee = () => {
        selectDialog(
            {
                title: 'Выбор сотрудника',
                description: '',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: employeeItems,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value:any) => {
                const item = {...priceItem};
                item.employee.id = value.id;
                item.employee.fio = value.name;
                dispatch(changePriceItem(item));
            }
        )
    }


    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Прайс для продукции"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            {priceItem.employee &&
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Paper elevation={0} className={classes.paper_root}>
                                        <TextField
                                            fullWidth
                                            label="Прайс сотрудника"
                                            margin="dense"
                                            name="name"
                                            onChange={handleChange}
                                            required
                                            value={priceItem.employee.fio}
                                            variant="outlined"
                                        />
                                        <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeEmployee}>
                                            <MenuOpenIcon />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            }
                            <Grid
                                item
                                xs={12}
                            >
                                <Paper elevation={0} className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        label="Продукт"
                                        margin="dense"
                                        name="name"
                                        onChange={handleChange}
                                        required
                                        value={priceItem.productName}
                                        variant="outlined"
                                    />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeProduct}>
                                        <MenuOpenIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>

                            <Grid
                                item
                                xs={6}
                            >
                                <Paper elevation={0} className={classes.paper_root}>
                                <TextField
                                    fullWidth
                                    label="Тара"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={priceItem.tareName}
                                    variant="outlined"
                                />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeTare}>
                                        <MenuOpenIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                            <Grid
                                item
                                xs={3}
                            >
                                <TextField

                                    label="Объём"
                                    margin="dense"
                                    name="name"
                                    required
                                    value={priceItem.tareV}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={3}
                            >
                                <TextField
                                    fullWidth
                                    label="Действие прайса"
                                    margin="dense"
                                    name="date"
                                    type="date"
                                    onChange={handleChange}
                                    required
                                    value={priceItem.date}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid
                                item
                                xs={3}
                            >
                                <TextField
                                    fullWidth
                                    label="Цена"
                                    margin="dense"
                                    name="price"
                                    onChange={handleChange}
                                    required
                                    value={priceItem.price}
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
                            type={"submit"}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/price'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default PriceItem;
