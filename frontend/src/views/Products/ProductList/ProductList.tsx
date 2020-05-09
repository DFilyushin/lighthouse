import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { ProductTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {loadProduct} from "redux/actions/productAction";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ProductList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const products = useSelector((state: any) => state.product.products);
    const isLoading = useSelector((state: any) => state.product.isLoading);
    const error_value = useSelector((state: any) => state.product.error);

    useEffect( ()=>{
            dispatch(loadProduct())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
    }

    function onDeleteHandle() {

    }

    function onClickTableItem(productId: number){
        const newItemUrl = `/catalogs/product/${productId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                newItemTitle={'Новый продукт'}
                newItemUrl={'/catalogs/product/new'}
                findCaption={'Поиск продукции'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <ProductTable
                        products={products}
                        onClickItem={onClickTableItem}
                        className={''}
                    />
                }
            </div>
        </div>
    );
};

export default ProductList;
