import {
    IContract,
    IContractListItem, IContractListItemSimple,
    IContractSpecItem, IWaitPaymentContractItem,
    nullContractItem,
    nullContractSpecItem, nullWaitPaymentContractItem
} from "types/model/contract";
import {hideInfoMessage, showInfoMessage} from "./infoAction";
import {
    CONTRACT_LOAD_FINISH,
    CONTRACT_LOAD_ITEM_SUCCESS,
    CONTRACT_LOAD_START,
    CONTRACT_LOAD_SUCCESS,
    CONTRACT_CHANGE_ITEM,
    CONTRACT_SET_ERROR,
    CONTRACT_LOAD_ACTIVE_CONTRACTS, CONTRACT_SHOW_OWN_CONTRACT_STATE
} from "./types";
import ContractEndpoint, {UNDEFINED_AGENT} from "services/endpoints/ContractEndpoint";
import authAxios from "../../services/axios-api";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";
import AuthenticationService from "../../services/Authentication.service";
import {getRandomInt, MAX_RANDOM_VALUE, RoundValue} from "../../utils/AppUtils";

/**
 * Получить список контрактов
 * @param state Состояние контракта
 */
export function loadContractList(state: number, onlyOwnContract: boolean, search?: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        const agentId = onlyOwnContract ? AuthenticationService.currentEmployeeId() : UNDEFINED_AGENT
        try {
            const url = ContractEndpoint.getContractList(state, agentId, search);
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
            const item = {...nullContractItem,
                'agent': {
                    id: AuthenticationService.currentEmployeeId(),
                    fio: AuthenticationService.currentEmployee(),
                    staff: '',
                    tabNum: ''
                }
            }
            dispatch(fetchItemSuccess(item))
        }else {
            try {
                const url = ContractEndpoint.getContract(id);
                const response = await authAxios.get(url);
                const item: IContract = response.data;
                // for (const spec of item.specs){
                //     spec.itemTotal = Math.round(spec.itemCount * spec.itemPrice * (spec.itemNds/100 +1) - spec.itemDiscount)
                // }
                if (func0) {func0(item)}
                dispatch(fetchItemSuccess(item))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить строку спецификации контракта
 * @param id Код записи
 */
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
        const newItem = {...nullContractSpecItem, id: -getRandomInt(MAX_RANDOM_VALUE), itemNds: getState().setup.nds}
        item.specs.unshift(newItem);
        dispatch(fetchItemSuccess(item))
    }
}

/**
 * Добавить новую пустую строку графика платежей
 */
export function addNewWaitPaymentItem() {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().contract.contractItem}
        const newItem = {...nullWaitPaymentContractItem, id: -getRandomInt(MAX_RANDOM_VALUE)}
        item.waitPayments.unshift(newItem)
        dispatch(fetchItemSuccess(item))
    }
}

/**
 * Удалить строку графика платежей
 * @param id
 */
export function deleteWaitPaymentItem(id: number) {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().contract.contractItem};
        const index = item.waitPayments.findIndex((item:IWaitPaymentContractItem, index: number, array: IWaitPaymentContractItem[])=> {return item.id === id});
        item.waitPayments.splice(index, 1);
        dispatch(fetchItemSuccess(item));
    }
}


/**
 * Добавить новый контракт
 * @param item Объект контракта
 */
export function addNewContract(item: IContract) {
    return async (dispatch: any, getState: any) => {
        try{
            delete item.created
            if (item.delivered === '') {item.delivered = null}
            await authAxios.post(ContractEndpoint.newContract(), item)
            return Promise.resolve()
        }catch (e) {
            console.log(e.toString())
            dispatch(saveError(e.toString()))
            return Promise.reject()
        }
    }
}

/**
 * Изменить существующий контракт
 * @param item Объект контракта
 */
export function updateContract(item: IContract) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(ContractEndpoint.updateContract(item.id), item)
            return Promise.resolve()
        }catch (e) {
            dispatch(saveError(e.toString()))
            return Promise.reject()
        }
    }
}

/**
 * Калькуляция скидки
 */
export function calculateDiscount() {
    return async (dispatch: any, getState: any)=> {
        const contract: IContract = {...getState().contract.contractItem}
        const discount = contract.discount
        const specs = contract.specs.map((value)=>{
            const ndsValue = value.itemNds/100 + 1
            const price_with_nds = value.itemPrice * ndsValue
            const discount_value = RoundValue(price_with_nds  * (discount / 100))
            value.itemDiscount = RoundValue(discount_value * value.itemCount)
            value.itemTotal = RoundValue((value.itemCount * price_with_nds) - discount_value)
            return value
        })
        dispatch(fetchItemSuccess({...contract, specs: specs}))
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
            await authAxios.post(ContractEndpoint.setContractStatus(contractItem.id, newStatus));
            dispatch(loadContractItem(contractItem.id))
            return Promise.resolve()
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
            return Promise.reject()
        }
    }
}

/**
 * Изменить элемент спецификации контракта
 * @param item Объект спецификации
 */
export function changeContractSpecItem(item: IContractSpecItem) {
    return async (dispatch: any, getState: any)=> {
        const contract = {...getState().contract.contractItem};
        const index = contract.specs.findIndex((elem: IContractSpecItem, index:number, array: IContractSpecItem[])=>{return elem.id === item.id})
        item.itemTotal = Math.round(item.itemCount * item.itemPrice * (item.itemNds/100 +1) - item.itemDiscount)
        contract.specs[index] = item
        dispatch(changeContractItem(contract));
    }
}

/**
 * Изменить элемент графика оплат
 * @param item Объект графика оплат
 */
export function changePaymentWaitItem(item: IWaitPaymentContractItem) {
    return async (dispatch: any, getState: any)=> {
        console.log('test........')
        const contract = {...getState().contract.contractItem};
        const index = contract.waitPayments.findIndex((elem: IWaitPaymentContractItem, index:number, array: IWaitPaymentContractItem[])=>{return elem.id === item.id})
        contract.waitPayments[index] = item
        dispatch(changeContractItem(contract));
    }
}

export function setShowOwnContract(value: boolean) {
    return{
        type: CONTRACT_SHOW_OWN_CONTRACT_STATE,
        value
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