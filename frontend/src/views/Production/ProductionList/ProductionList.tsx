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
import {PROD_PERIOD_END, PROD_PERIOD_START, PROD_PRODUCT, PROD_STATE} from "../../../types/Settings";
import {useConfirm} from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {CARD_STATE_IN_WORK} from "../../../types/model/production";
import {IStateInterface} from "../../../redux/rootReducer";

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
    const confirm = useConfirm();

    const cards = useSelector((state: IStateInterface) => state.production.prodCardList);
    const products = useSelector((state: IStateInterface) => state.product.products);
    const isLoading = useSelector((state: IStateInterface) => state.production.isLoading);
    const errorValue = useSelector((state: IStateInterface) => state.production.error);
    const alertType = useSelector((state: any) => state.production.typeMessage);
    const hasError = useSelector((state: IStateInterface) => state.product.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        dispatch(clearError())
    };

    function refreshOnLoad(){
        const date = (new Date()).toISOString().slice(0, 10)
        handleRefresh(date, date, CARD_STATE_IN_WORK)
    }

    useEffect(()=>{
        refreshOnLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=>{
            dispatch(loadProduct());
        }, [dispatch]
    );

    function handleRefresh(startDate: string, endDate: string, state?: number, product?: number ){
        localStorage.setItem(PROD_PERIOD_START, startDate);
        localStorage.setItem(PROD_PERIOD_END, endDate);
        state ? localStorage.setItem(PROD_STATE, state.toString()) : localStorage.removeItem(PROD_STATE)
        product ? localStorage.setItem(PROD_PRODUCT, product.toString()) : localStorage.removeItem(PROD_PRODUCT);

        dispatch(loadProductionCards(startDate, endDate, '', product, state))
    }

    async function onFindProductHandler(findText: string){
        dispatch(loadProductionCards('', '', findText))
    }

    /**
     * Обработчик удаления карт
     */
    function onDeleteHandle() {
        if (selected.length === 0 ) return;
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item) => {
                dispatch(deleteProductionCard(item))
            })
        )

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
