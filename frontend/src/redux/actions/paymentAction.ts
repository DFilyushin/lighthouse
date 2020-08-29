import {
    PAYMENT_CHANGE_ITEM,
    PAYMENT_DELETE_OK,
    PAYMENT_LOAD_FINISH,
    PAYMENT_LOAD_START,
    PAYMENT_SUCCESS,
    PAYMENT_SUCCESS_ITEM
} from "./types"
import {IPaymentItem, IPaymentListItem, nullPaymentItem} from "types/model/payment"
import {hideInfoMessage, showInfoMessage} from "./infoAction"
import PaymentEndpoint from "services/endpoints/PaymentEndpoint"
import {NEW_RECORD_VALUE} from "utils/AppConst"
import ContractEndpoint from "../../services/endpoints/ContractEndpoint"
import {IContract} from "../../types/model/contract"
import authAxios from "../../services/axios-api";


/**
 * Загрузить список оплат за период
 * @param startDate Начальная дата
 * @param endDate Конечная дата
 * @param method Метод оплаты
 */
export function loadPaymentList(startDate: string, endDate: string, method?: number, numContract?: string) {
    return async (dispatch: any, getState: any)=> {
        dispatch(loadStart())
        dispatch(hideInfoMessage())
        const url = PaymentEndpoint.getPaymentList(startDate, endDate, method, numContract)
        const items: IPaymentListItem[] = []
        try{
            const response = await authAxios.get(url)
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(loadItemsSuccess(items))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(loadFinish())
    }
}

/**
 * Удалить платёж по коду
 * @param id Код записи
 */
export function deletePayment(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage())
        try{
            await authAxios.delete(PaymentEndpoint.deletePayment(id));
            const items = [...getState().payment.paymentItems];
            const index = items.findIndex((elem)=>{return elem.id === id});
            items.splice(index, 1);
            dispatch(deleteOK(items));
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось удалить запись!'))
        }
    }
}

/**
 * Загрузить элемент оплаты по коду записи
 * @param id Код записи
 */
export function loadPaymentItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(loadStart())
        dispatch(hideInfoMessage())
        if (id === NEW_RECORD_VALUE) {
            dispatch(loadItemSuccess({...nullPaymentItem}))
        }else {
            const url = PaymentEndpoint.getPaymentItem(id)
            try {
                const response = await authAxios.get(url)
                dispatch(loadItemSuccess(response.data))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
        dispatch(loadFinish())
    }
}

export function newPaymentByContract(contractId: number) {
    return async (dispatch: any, getState: any) => {
        const url = await ContractEndpoint.getContract(contractId)
        try {
            const response = await authAxios.get(url)
            const contract: IContract = response.data
            let item: IPaymentItem = {...getState().payment.paymentItem,
                contract: {
                    id: contract.id,
                    client: contract.client.clientName,
                    num: contract.num,
                    date: contract.contractDate
                }
            }
            dispatch(loadItemSuccess(item))
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось получить контракт!' + e.toString()))
        }
    }
}

/**
 * Обновить данные
 * @param item Объект оплаты
 */
export function updatePaymentItem(item: IPaymentItem) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(PaymentEndpoint.updatePayment(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', e.response.data.error.toString()))
        }
    }
}

/**
 * Добавить новую запись
 * @param item Объект оплаты
 */
export function addNewPaymentItem(item: IPaymentItem) {
    return async (dispatch: any, getState: any) => {
        try{
            const new_item = {...item}
            delete new_item.created
            await authAxios.post(PaymentEndpoint.addNewPayment(), new_item)
            return Promise.resolve()
        }catch (e) {
            dispatch(showInfoMessage('error', e.response.data.error.toString()))
            return Promise.reject()
        }
    }
}


export function changePayment(item: IPaymentItem) {
    return async (dispatch: any, getState: any) => {
        dispatch(changePaymentItem(item))
    }
}

function changePaymentItem(item: IPaymentItem) {
    return{
        type: PAYMENT_CHANGE_ITEM,
        item
    }
}

function loadStart() {
    return {
        type: PAYMENT_LOAD_START
    }
}

function loadFinish() {
    return{
        type: PAYMENT_LOAD_FINISH
    }
}

function loadItemsSuccess(items: IPaymentListItem[]) {
    return{
        type: PAYMENT_SUCCESS,
        items
    }
}

function loadItemSuccess(item: IPaymentItem) {
    return{
        type: PAYMENT_SUCCESS_ITEM,
        item
    }
}

function deleteOK(items: IPaymentListItem[]) {
    return{
        type: PAYMENT_DELETE_OK,
        items
    }
}

