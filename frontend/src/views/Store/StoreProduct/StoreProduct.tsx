import React, {useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {StoreTable, StoreToolbar} from '../components';
import SnackBarAlert from 'components/SnackBarAlert';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {clearStoreError, loadProductStore} from "redux/actions/storeAction";
import { ReactComponent as ProductWarehouse } from 'images/warehouse.svg';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const StoreProduct = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading);
    const productStore = useSelector((state: IStateInterface) => state.store.productStore);
    const hasError = useSelector((state: IStateInterface) => state.store.hasError);
    const errorText = useSelector((state: IStateInterface) => state.store.error);


    useEffect(() => {
        dispatch(loadProductStore())
    }, [dispatch]);

    function onClickTableItem(clientId: number){
        const clientUrl = ``;
        history.push(clientUrl);
    }

    async function onFindHandler(findText: string){
    }

    function closeAlert() {
        dispatch(clearStoreError())
    }

    return (
        <div className={classes.root}>
            <StoreToolbar
                className={''}
                title={'Склад готовой продукции'}
                onFind={onFindHandler}
                icon={<ProductWarehouse />}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                        : <StoreTable
                            store={productStore}
                            className={''}
                            onClickItem={onClickTableItem}
                        />
                }
            </div>
            <SnackBarAlert
                typeMessage={'error'}
                messageText={errorText}
                isOpen={hasError}
                onSetOpenState={closeAlert}
            />
        </div>
    );
};

export default StoreProduct;
