import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {StoreTable, StoreToolbar} from '../components';
import SnackBarAlert from 'components/SnackBarAlert';
import { Color } from '@material-ui/lab/Alert';
import {deleteClient, loadClients} from "redux/actions/clientAction";
import {useDispatch, useSelector} from "react-redux";
import {DefaultToolbar} from "components";
import {IStateInterface} from "redux/rootReducer";
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import {loadRawStore} from "../../../redux/actions/storeAction";
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

const StoreRaw = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    // @ts-ignore
    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading);
    const rawStore = useSelector((state: IStateInterface) => state.store.rawStore);
    const [selected, setSelected] = useState<number[]>([]);
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
        dispatch(loadClients(findText))
    }

    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteClient(item))
        });
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
                            onChangeSelected={setSelected}
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

export default StoreRaw;
