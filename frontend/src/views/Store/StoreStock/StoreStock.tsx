import React, {useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {StoreTable, StoreToolbar} from '../components';
import SnackBarAlert from 'components/SnackBarAlert';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {clearStoreError, loadRawStore, loadStockStore} from "redux/actions/storeAction";
import {BuildingWarehouse} from 'tabler-icons-react';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const StoreStock = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading);
    const stockStore = useSelector((state: IStateInterface) => state.store.stockStore);
    const hasError = useSelector((state: IStateInterface) => state.store.hasError);
    const errorText = useSelector((state:IStateInterface) => state.store.error);


    useEffect(() => {
        dispatch(loadStockStore())
    }, [dispatch]);

    function onClickTableItem(id: number){
        history.push(`/store/journal/material/${id}`);
    }

    async function onFindHandler(findText: string){
        dispatch(loadRawStore(findText))
    }

    function closeAlert() {
        dispatch(clearStoreError())
    }

    return (
        <div className={classes.root}>
            <StoreToolbar
                className={''}
                title={'Склад ТМЦ'}
                onFind={onFindHandler}
                icon={<BuildingWarehouse color={"black"} />}
                onFindCaption={'Поиск по наименованию'}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                        : <StoreTable
                            store={stockStore}
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

export default StoreStock;
