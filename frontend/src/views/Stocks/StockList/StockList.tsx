import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { StockTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import SnackBarAlert from 'components/SnackBarAlert';
import { useConfirm } from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";
import {deleteStock, loadStockList} from "../../../redux/actions/stockAction";
import {clearStoreError} from "../../../redux/actions/storeAction";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const StockList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const stocks = useSelector((state: IStateInterface) => state.stock.stocks);
    const isLoading = useSelector((state: IStateInterface) => state.stock.isLoading);
    const errorValue = useSelector((state: IStateInterface) => state.stock.error);
    const alertType = useSelector((state: any) => state.stock.typeMessage);
    const hasError = useSelector((state: IStateInterface) => state.stock.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        dispatch(clearStoreError())
    };

    useEffect( ()=>{
            dispatch(loadStockList())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadStockList(findText))
    }

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
            selected.forEach(async (item, i, selected) => {
                dispatch(deleteStock(item))
            })
        )
    }

    function onClickTableItem(rawId: number){
        const newItemUrl = `/catalogs/stock/${rawId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Товарно материальные запасы'}
                newItemTitle={'Новый ТМЦ'}
                newItemUrl={'/catalogs/stock/new'}
                findCaption={'Поиск ТМЦ'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <StockTable
                        stocks={stocks}
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

export default StockList;
