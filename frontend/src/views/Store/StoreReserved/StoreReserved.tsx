import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {StoreTable, StoreToolbar} from '../components';
import SnackBarAlert from 'components/SnackBarAlert';
import { Color } from '@material-ui/lab/Alert';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {loadRawStore} from "redux/actions/storeAction";
//import train from 'images/train.svg';
import { ReactComponent as RawTrain } from 'images/train.svg';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));


const StoreReserved = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    // @ts-ignore
    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading);
    const rawStore = useSelector((state: IStateInterface) => state.store.rawStore);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [typeAlert, setTypeAlert] = useState<Color>('success');


    useEffect(() => {
        dispatch(loadRawStore())
    }, [dispatch]);

    function onClickTableItem(clientId: number){
        const clientUrl = `/client/${clientId}`;
        history.push(clientUrl);
    }

    async function onFindClientHandler(findText: string){

    }

    return (
        <div className={classes.root}>
            <StoreToolbar
                className={''}
                title={'Склад сырья'}
                onFind={onFindClientHandler}
                icon={<RawTrain />}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                        : <StoreTable
                            store={rawStore}
                            className={''}
                            onClickItem={onClickTableItem}
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
