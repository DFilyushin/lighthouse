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
import {addNewProduct, changeProduct, loadProductItem, updateProduct} from "redux/actions/productAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";


interface IProductItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const ProductItem = (props: IProductItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const paramId = props.match.params.id;
    const productId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const productItem  = useSelector((state: any)=> state.product.productItem);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const product = {...productItem, [event.target.name]: event.target.value};
        dispatch(changeProduct(product))
    };

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (productId === NEW_RECORD_VALUE) {
                await dispatch(addNewProduct(productItem));
            } else {
                await dispatch(updateProduct(productItem));
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
            history.push('/catalogs/product');
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
        dispatch(loadProductItem(productId));
    }, [dispatch, productId]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Продукция"
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
                                    label="Наименование продукции"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={productItem.name}
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
                            onClick={(event => history.push('/catalogs/product'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default ProductItem;
