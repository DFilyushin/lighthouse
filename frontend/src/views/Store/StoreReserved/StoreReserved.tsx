import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {StoreReserveTable, StoreToolbar} from '../components';
import SnackBarAlert from 'components/SnackBarAlert';
import { Color } from '@material-ui/lab/Alert';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {deleteReserve, loadStoreReserveList} from "redux/actions/storeAction";
import { ReactComponent as RawTrain } from 'images/train.svg';
import {
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES} from "../../../utils/AppConst";
import {useConfirm} from "material-ui-confirm";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));


const StoreReserved = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const confirm = useConfirm();

    // @ts-ignore
    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading)
    const storeReserve = useSelector((state: IStateInterface) => state.store.storeReservedList)
    const [showAlert, setShowAlert] = useState(false)
    const [messageAlert, setMessageAlert] = useState('')
    const [typeAlert, setTypeAlert] = useState<Color>('success')


    useEffect(() => {
        dispatch(loadStoreReserveList())
    }, [dispatch]);

    function onClickTableItem(contractId: number){
        const clientUrl = `/contracts/${contractId}?source=reserved`;
        history.push(clientUrl);
    }

    function onDeleteTableItem(id: number){
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteReserve(id))
        )

    }

    async function onFindProductHandler(findText: string){

    }

    return (
        <div className={classes.root}>
            <StoreToolbar
                className={''}
                title={'Резервирование продукции'}
                onFind={onFindProductHandler}
                icon={<RawTrain />}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                        : <StoreReserveTable
                            store={storeReserve}
                            className={''}
                            onClickItem={onClickTableItem}
                            onDeleteItem={onDeleteTableItem}
                        />
                }
            </div>
            <SnackBarAlert
                typeMessage={typeAlert}
                messageText={messageAlert}
                isOpen={showAlert}
                onSetOpenState={setShowAlert}
            />
        </div>
    );
};

export default StoreReserved;
