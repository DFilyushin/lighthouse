import {hideInfoMessage, showInfoMessage} from "./infoAction";
import axios from "axios";
import {
    CLIENT_LOAD_CONTRACT_SUCCESS,
    CLIENT_LOAD_FINISH,
    CLIENT_LOAD_ITEM_SUCCESS,
    CLIENT_LOAD_START,
    CLIENT_LOAD_SUCCESS, CLIENT_SEARCH_SUCCESS
} from "./types";
import {IClientItem, IClientItemList, nullClientItem} from "types/model/client";
import ClientEndpoint from "services/endpoints/ClientEndpoint";
import AuthenticationService from "services/Authentication.service";
import {IContractListItem} from "types/model/contract";


/**
 * Загрузить список клиентов
 * @param search Строка поиска
 * @param limit Лимит вывода записей
 * @param offset Сдвиг
 */
export function loadClients(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());

        try {
            const url = ClientEndpoint.getClientList(search);
            const items: IClientItemList[] = [];
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchSuccess(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить клиента по коду
 * @param id Код записи
 */
export function loadClientItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        if (id===0){
            dispatch(fetchItemSuccess(nullClientItem))
        }else {
            try {
                const url = ClientEndpoint.getClientItem(id);
                const response = await axios.get(url);
                const item: IClientItem = response.data;
                dispatch(fetchItemSuccess(item))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить клиента
 * @param id Код клиента
 */
export function deleteClient(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(ClientEndpoint.deleteClient(id));
            if (response.status === 204) {
                const items = [...getState().client.items];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
                dispatch(showInfoMessage('info', 'Запись успешно удалена'))
            }
            else {
                dispatch(showInfoMessage('error', `Неизвестная ошибка при удалении: ${response.status.toString()}`))
            }
        }catch (e) {
            dispatch(showInfoMessage('error', `Не удалось удалить запись ${e.toString()}!`))
        }
        dispatch(fetchFinish())
    }
}

export function searchClients(name: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());

        try {
            const url = ClientEndpoint.getClientList(name);
            const items: IClientItemList[] = [];
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchSuccessSearch(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Новый клиент
 * @param item
 */
export function addNewClient(item: IClientItem) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage());
        let curItem = {...item, 'agentId': AuthenticationService.currentEmployeeId()};
        console.log(JSON.stringify(curItem));

        try{
            await axios.post(ClientEndpoint.newClient(), curItem);
            return Promise.resolve();
        }
        catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
            return Promise.reject();
        }
    }
}

/**
 * Обновление данных клиента
 * @param item
 */
export function updateClient(item: IClientItem) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage());
        try{
            await axios.put(ClientEndpoint.saveClient(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Загрузить список контрактов по клиенту
 * @param id Код клиента
 */
export function loadClientContracts(id: number) {
    return async (dispatch: any, getState: any) => {
        const items: IContractListItem[] = [];
        dispatch(hideInfoMessage());
        try{
            const response = await axios.get(ClientEndpoint.getClientContract(id));
            console.log(response)
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchClientContractSuccess(items));
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось загрузить список контрактов клиента!'))
        }
    }
}

export function changeClientItem(item: IClientItem) {
    return{
        type: CLIENT_LOAD_ITEM_SUCCESS,
        item
    }
}

function fetchClientContractSuccess(items: IContractListItem[]) {
    return{
        type: CLIENT_LOAD_CONTRACT_SUCCESS,
        items
    }
}


function deleteOk(items: IClientItemList[]) {
    return{
        type: CLIENT_LOAD_SUCCESS,
        items
    }
}

function fetchStart() {
    return{
        type: CLIENT_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: CLIENT_LOAD_FINISH
    }
}

function fetchSuccess(items: IClientItemList[]) {
    return{
        type: CLIENT_LOAD_SUCCESS,
        items
    }
}

function fetchItemSuccess(item: IClientItem) {
    return{
        type: CLIENT_LOAD_ITEM_SUCCESS,
        item
    }
}

function fetchSuccessSearch(items: IClientItemList[]) {
    return{
        type: CLIENT_SEARCH_SUCCESS,
        items
    }
}