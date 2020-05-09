import React, { useState, useEffect } from 'react';
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


interface IProductItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const nullProduct = {
    id: 0,
    name: ''
};

const ProductItem = (props: IProductItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const productId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;

    console.log('ProductItem', productId)

    const productItem  = useSelector((state: any)=> state.product.productItem);
    const isLoading = useSelector((state: any) => state.product.isLoading);
    const error_value = useSelector((state: any) => state.product.error);


    async function saveNewProduct() {
        // const saveUrl = ProductEndpoint.newProduct();
        // console.log(saveUrl);
        // console.log(JSON.stringify(client));
        // try{
        //     const response = await axios.post(saveUrl, client);
        //     if (response.status === 201){
        //         history.push('/catalogs/product')
        //     }else{
        //         console.log(response.statusText)
        //     }
        // }
        // catch (e) {
        //     console.log(e.message)
        // }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const product = {...productItem, [event.target.name]: event.target.value};
        dispatch(changeProduct(product))
    };

    const saveHandler = (event: React.MouseEvent) => {
        if (productId === 0) {
            dispatch(addNewProduct(productItem));
        } else {
            dispatch(updateProduct(productItem));
        }

    };

    useEffect( ()=> {
        dispatch(loadProductItem(productId));
    }, [dispatch]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
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
                            onClick={saveHandler}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="secondary"
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
