import {
    PAY_METHOD_CHANGE_ITEM,
    PAY_METHOD_DELETE_OK,
    PAY_METHOD_LOAD_FINISH,
    PAY_METHOD_LOAD_START,
    PAY_METHOD_SUCCESS,
    PAY_METHOD_SUCCESS_ITEM
} from "./types"
import PayMethodEndpoint from "services/endpoints/PayMethodEndpoint"
import {hideInfoMessage, showInfoMessage} from "./infoAction"
import {IPayMethod} from "types/model/paymethod"
import axios from "axios"


/**
 * Загрузить список методы оплат
 */
export function loadPayMethodItems() {
    return async (dispatch: any, getState: any) => {
        dispatch(loadStart())
        dispatch(hideInfoMessage())
        const url = PayMethodEndpoint.getPayMethodList()
        const items: IPayMethod[] = []
        try{
            const response = await axios.get(url)
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchSuccess(items))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(loadFinish())
    }
}

/**
 * Загрузить объект метода платежа
 * @param id Код записи
 */
export function loadPayMethodItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(loadStart())
        dispatch(hideInfoMessage())
        const url = PayMethodEndpoint.getPayMethod(id)
        try{
            const response = await axios.get(url)
            dispatch(fetchSuccessItem(response.data))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(loadFinish())
    }
}

/**
 * Удалить метод оплаты
 * @param id Код записи
 */
export function deletePayMethod(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(loadStart());
        try{
            const response = await axios.delete(PayMethodEndpoint.deletePayMethod(id));
            if (response.status === 204) {
                const items = [...getState().payMethod.payMethodItems];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOK(items));
            }
            else {
                dispatch(showInfoMessage('error', 'Не удалось удалить запись!'))
            }
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось удалить запись!'))
        }
        dispatch(loadFinish())
    }
}

/**
 * Обновить изменения в методе оплат
 * @param item Обновляемый элемент
 */
export function updatePayMethod(item: IPayMethod) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage());
        try{
            await axios.put(PayMethodEndpoint.updatePayMethod(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

export function changePayMethod(item: IPayMethod) {
    return async (dispatch: any, getState: any) => {
        dispatch(changePayMethodItem(item))
    }
}

function changePayMethodItem(item: IPayMethod) {
    return {
        type: PAY_METHOD_CHANGE_ITEM,
        item
    }
}

function deleteOK(items: IPayMethod[]) {
    return{
        type: PAY_METHOD_DELETE_OK,
        items
    }
}

function loadStart() {
    return{
        type: PAY_METHOD_LOAD_START
    }
}

function loadFinish() {
    return{
        type: PAY_METHOD_LOAD_FINISH
    }
}

function fetchSuccess(items: IPayMethod[]) {
    return{
        type: PAY_METHOD_SUCCESS,
        items
    }
}

function fetchSuccessItem(item: IPayMethod) {
    return{
        type: PAY_METHOD_SUCCESS_ITEM,
        item
    }
}