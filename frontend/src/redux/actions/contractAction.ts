import {
    IContract,
    IContractListItem, IContractListItemSimple,
    IContractSpecItem,
    nullContractItem,
    nullContractSpecItem
} from "types/model/contract";
import {hideInfoMessage, showInfoMessage} from "./infoAction";
import {
    CONTRACT_LOAD_FINISH,
    CONTRACT_LOAD_ITEM_SUCCESS,
    CONTRACT_LOAD_START,
    CONTRACT_LOAD_SUCCESS,
    CONTRACT_CHANGE_ITEM,
    CONTRACT_SET_ERROR,
    CONTRACT_LOAD_ACTIVE_CONTRACTS
} from "./types";
import ContractEndpoint from "services/endpoints/ContractEndpoint";
import authAxios from "../../services/axios-api";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";

/**
 * Получить список контрактов
 * @param state Состояние контракта
 */
export function loadContractList(state: number, search?: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());

        try {
            const url = ContractEndpoint.getContractList(state, search);
            const items: IContractListItem[] = [];
            const response = await authAxios.get(url);
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
 * Загрузить список активных контрактов
 */
export function loadActiveContractsList(num: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());

        try {
            const url = ContractEndpoint.getActiveContractList(num);
            const items: IContractListItemSimple[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchSuccessActive(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить контракт
 * @param id Код контракта
 */
export function deleteContract(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await authAxios.delete(ContractEndpoint.deleteContract(id));
            if (response.status === 204) {
                const items = [...getState().contract.items];
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

/**
 * Загрузить контракт
 * @param id Код контракта
 */
export function loadContractItem(id: number, func0?: any) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        if (id===NEW_RECORD_VALUE){
            dispatch(fetchItemSuccess(nullContractItem))
        }else {
            try {
                const url = ContractEndpoint.getContract(id);
                const response = await authAxios.get(url);
                const item: IContract = response.data;
                if (func0) {func0(item)}
                dispatch(fetchItemSuccess(item))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
        dispatch(fetchFinish())
    }
}

export function deleteContractSpecItem(id: number) {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().contract.contractItem};
        const index = item.specs.findIndex((item:IContractSpecItem, index: number, array: IContractSpecItem[])=> {return item.id === id});
        item.specs.splice(index, 1);
        dispatch(fetchItemSuccess(item));

    }
}

/**
 * Добавить новую пустую строку спецификации
 */
export function addNewSpecItem() {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().contract.contractItem};
        item.specs.unshift(nullContractSpecItem);
        dispatch(fetchItemSuccess(item))
    }
}


/**
 * Добавить новый контракт
 * @param item Объект контракта
 */
export function addNewContract(item: IContract) {

}

/**
 * Изменить существующий контракт
 * @param item Объект контракта
 */
export function updateContract(item: IContract) {
    return async (dispatch: any, getState: any) => {
        try{
            const response = await authAxios.put(ContractEndpoint.updateContract(item.id), item);
            console.log(response);
        }catch (e) {
            dispatch(saveError(e.toString()))
        }
    }
}

/**
 * Установить статус контракта
 * @param newStatus Код статуса
 */
export function setContractStatus(newStatus: number) {
    return async (dispatch: any, getState: any) => {
        const contractItem = {...getState().contract.contractItem}
        try{
            const response = await authAxios.post(ContractEndpoint.setContractStatus(contractItem.id, newStatus));
            dispatch(loadContractItem(contractItem.id))
            return Promise.resolve()
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
            return Promise.reject()
        }
    }
}


export function changeContractItem(item: IContract) {
    return{
        type: CONTRACT_CHANGE_ITEM,
        item: item
    }
}

function fetchSuccessActive(items: IContractListItemSimple[]) {
    return{
        type: CONTRACT_LOAD_ACTIVE_CONTRACTS,
        items
    }
}

function fetchStart() {
    return {
        type: CONTRACT_LOAD_START
    }
}

function fetchFinish() {
    return {
        type: CONTRACT_LOAD_FINISH
    }
}

function fetchSuccess(items: IContractListItem[]) {
    return{
        type: CONTRACT_LOAD_SUCCESS,
        items
    }
}

function deleteOk(items: IContractListItem[]) {
    return{
        type: CONTRACT_LOAD_SUCCESS,
        items
    }
}

function fetchItemSuccess(item: IContract) {
    return{
        type: CONTRACT_LOAD_ITEM_SUCCESS,
        item
    }
}

function saveError(error: string) {
    return{
        type: CONTRACT_SET_ERROR,
        error
    }
}