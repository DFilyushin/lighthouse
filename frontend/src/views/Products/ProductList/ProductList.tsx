import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { ProductTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {clearError, deleteProduct, loadProduct} from "redux/actions/productAction";
import SnackBarAlert from 'components/SnackBarAlert';
import { useConfirm } from "material-ui-confirm";

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
    const confirm = useConfirm();

    const products = useSelector((state: any) => state.product.products);
    const isLoading = useSelector((state: any) => state.product.isLoading);
    const errorValue = useSelector((state: any) => state.product.error);
    const alertType = useSelector((state: any) => state.product.typeMessage);
    const hasError = useSelector((state: any) => state.product.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        dispatch(clearError())
    };

    useEffect( ()=>{
            dispatch(loadProduct())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadProduct(findText))
    }

    function onDeleteHandle() {
        confirm(
            {
                'title': 'Подтверждение',
                description: `Удалить выбранные записи?.`,
                confirmationText:'Да',
                cancellationText: 'Нет'
            }
        ).then(() =>
            selected.forEach(async (item, i, selected) => {
                dispatch(deleteProduct(item))
            })
        )
        ;
    }

    function onClickTableItem(productId: number){
        const newItemUrl = `/catalogs/product/${productId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Продукция'}
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
                        onChangeSelected={setSelected}
                    />
                }
            </div>
            <SnackBarAlert
                typeMessage={alertType}
                messageText={errorValue}
                isOpen={hasError}
                onSetOpenState={handleClose}
            />
        </div>
    );
};

export default ProductList;
