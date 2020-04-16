import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import ClientEndpoint from 'services/endpoints/clients';
import CircularIndeterminate from "components/Loader/Loader";
import { ClientTable, ClientToolbar } from './components';
import { IClientItemList } from '../../IInterfaces';
import SnackBarAlert from 'components/SnackBarAlert';
import { Color } from '@material-ui/lab/Alert';


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
    const history = useHistory();

    // @ts-ignore
    const [clients, setClients] = useState<IClientItemList[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<number[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [typeAlert, setTypeAlert] = useState<Color>('success');

    async function loadData() {
        setLoading(true);
        const response = await axios.get(ClientEndpoint.getClients());
        const data = await response.data;
        setClients(data);
        setLoading(false);
    };

    async function findClients(findText: string){
        setLoading(true);
        const response = await axios.get(ClientEndpoint.getClients(findText));
        const data = await response.data;
        setClients(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    function onClickTableItem(clientId: number){
        const clientUrl = `/client/${clientId}`;
        history.push(clientUrl);
    };

    function onDeleteHandle() {
        const newClients = [...clients];
        selected.forEach(async (item, i, selected) => {
            const response = await axios.delete(ClientEndpoint.deleteClient(item));
            if (response.status === 200){
                console.log(newClients.length);
                const indexItem = newClients.findIndex(
                    function (element, index, array) {
                        return (element.id === item)}
                        );
                if (indexItem > -1){
                    newClients.splice(indexItem, 1);
                }
                setMessageAlert('Клиент удалён');
                setShowAlert(true);
            }
        });
        setClients(newClients);
    }

    return (
        <div className={classes.root}>
            <ClientToolbar className={''} onFind={findClients} onDelete={onDeleteHandle}/>
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
