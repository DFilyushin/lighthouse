import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { ProductionTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { ProductionToolbar } from '../components/';
import {clearError, loadProduct} from "redux/actions/productAction";
import SnackBarAlert from 'components/SnackBarAlert';
import {deleteProductionCard, loadProductionCards} from "redux/actions/productionAction";
import {PROD_PERIOD_END, PROD_PERIOD_START, PROD_PRODUCT} from "../../../types/Settings";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ProductionList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const cards = useSelector((state: any) => state.production.prodCardList);
    const products = useSelector((state: any) => state.product.products);
    const isLoading = useSelector((state: any) => state.production.isLoading);
    const errorValue = useSelector((state: any) => state.production.error);
    const alertType = useSelector((state: any) => state.production.typeMessage);
    const hasError = useSelector((state: any) => state.product.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        dispatch(clearError())
    };

    function refreshOnLoad(){
        const d1: string|null = localStorage.getItem(PROD_PERIOD_START);
        const d2: string|null = localStorage.getItem(PROD_PERIOD_END);
        //const product: string|null = localStorage.getItem(PROD_PRODUCT);
        if (d1 && d2){
            handleRefresh(new Date(d1), new Date(d2))
        }
    }

    useEffect(()=>{
        refreshOnLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=>{
            dispatch(loadProduct());
        }, [dispatch]
    );

    function handleRefresh(startDate: Date | null, endDate: Date | null, product?: number, state?: number){
        const date1 = startDate!.toISOString().slice(0, 10);
        const date2 = endDate!.toISOString().slice(0, 10);
        localStorage.setItem(PROD_PERIOD_START, date1);
        localStorage.setItem(PROD_PERIOD_END, date2);
        product ? localStorage.setItem(PROD_PRODUCT, product.toString()) : localStorage.removeItem(PROD_PRODUCT);

        dispatch(loadProductionCards(date1, date2, '', product))
    }

    async function onFindProductHandler(findText: string){
        dispatch(loadProductionCards('', '', findText))
    }

    /**
     * Обработчик удаления карт
     */
    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteProductionCard(item))
        });
    }

    /**
     * Выбор карты
     * @param id
     */
    function onClickTableItem(id: number){
        const editItemUrl = `/factory/${id}`;
        history.push(editItemUrl);
    }

    return (
        <div className={classes.root}>
            <ProductionToolbar
                className={''}
                products={products}
                newItemUrl={'/factory/new'}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}
                onRefresh={handleRefresh}
            />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <ProductionTable
                        items={cards}
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

export default ProductionList;
