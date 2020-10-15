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
import {useDispatch, useSelector} from "react-redux";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";
import {addNewStock, changeStock, loadStockItem, updateStock} from "../../../redux/actions/stockAction";


interface IStockItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const StockItem = (props: IStockItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const stockId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const stockItem  = useSelector((state: IStateInterface)=> state.stock.stockItem);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStock = {...stockItem, [event.target.name]: event.target.value};
        dispatch(changeStock(newStock))
    };

    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (stockId === NEW_RECORD_VALUE) {
                await dispatch(addNewStock(stockItem));
            } else {
                await dispatch(updateStock(stockItem));
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
        saveItem(dispatch).then( () => {
                history.push('/catalogs/stock');
            }
        )
    };

    useEffect( ()=> {
        dispatch(loadStockItem(stockId));
    }, [dispatch, stockId]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="ТМЦ"
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
                                    label="Наименование ТМЦ"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={stockItem.name}
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
                            onClick={(event => history.push('/catalogs/stock'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default StockItem
