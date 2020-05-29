import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import { ClientTable } from './components';
import SnackBarAlert from 'components/SnackBarAlert';
import { Color } from '@material-ui/lab/Alert';
import {deleteClient, loadClients} from "../../redux/actions/clientAction";
import {useDispatch, useSelector} from "react-redux";
import {DefaultToolbar} from "../../components";
import {IStateInterface} from "../../redux/rootReducer";
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ClientList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    // @ts-ignore
    const isLoading = useSelector((state: IStateInterface) => state.client.isLoading);
    const clients = useSelector((state: IStateInterface) => state.client.items);
    const [selected, setSelected] = useState<number[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [typeAlert, setTypeAlert] = useState<Color>('success');


    useEffect(() => {
        dispatch(loadClients())
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
            <DefaultToolbar 
                className={''}
                showDelete={true}
                title={'Клиенты'}
                newItemUrl={'/client/new'}
                newItemTitle={'Новый клиент'}
                findCaption={'Поиск клиента'}
                onFind={onFindClientHandler}
                onDelete={onDeleteHandle}
                icon={<GroupOutlinedIcon color={"primary"}/>}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                    : <ClientTable
                            clients={clients}
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

export default ClientList;
