import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import { ClientTable } from '../components/index';
import {deleteClient, loadClients} from "redux/actions/clientAction";
import {useDispatch, useSelector} from "react-redux";
import {DefaultToolbar} from "components";
import {IStateInterface} from "redux/rootReducer";
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {useConfirm} from "material-ui-confirm";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ClientList = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const confirm = useConfirm()

    // @ts-ignore
    const isLoading = useSelector((state: IStateInterface) => state.client.isLoading);
    const clients = useSelector((state: IStateInterface) => state.client.items);
    const [selected, setSelected] = useState<number[]>([]);


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

    /**
     * Удаление клиента
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
        ).then(() => {
            selected.forEach(async (item) => {
                dispatch(deleteClient(item))
            });
        })
    }


    return (
        <div className={classes.root}>
            <DefaultToolbar 
                className={''}
                showDelete={true}
                title={'Клиенты'}
                newItemUrl={'/client/new'}
                newItemTitle={'Новый клиент'}
                findCaption={'Поиск клиента по наименованию или БИН'}
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
        </div>
    );
};

export default ClientList;
