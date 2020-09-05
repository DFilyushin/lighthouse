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
import {IPayMethod, nullPayMethod} from "types/model/paymethod"
import {NEW_RECORD_VALUE} from "utils/AppConst";
import authAxios from "../../services/axios-api";


/**
 * Загрузить список методы оплат
 */
export function loadPayMethodItems(search?: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(loadStart())
        dispatch(hideInfoMessage())
        const url = PayMethodEndpoint.getPayMethodList(search)
        const items: IPayMethod[] = []
        try{
            const response = await authAxios.get(url)
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
        if (id === NEW_RECORD_VALUE) {
            dispatch(fetchSuccessItem({...nullPayMethod}))
        }else {
            const url = PayMethodEndpoint.getPayMethod(id)
            try {
                const response = await authAxios.get(url)
                dispatch(fetchSuccessItem(response.data))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
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
            const response = await authAxios.delete(PayMethodEndpoint.deletePayMethod(id));
            if (response.status === 204) {
                const items = [...getState().payMethod.payMethodItems];
                const index = items.findIndex((elem)=>{return elem.id === id});
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
            await authAxios.put(PayMethodEndpoint.updatePayMethod(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось сохранить данные!'))
            throw e
        }
    }
}

/**
 * Добавить новую запись
 * @param item Добавляемый объект
 */
export function addNewPayMethod(item: IPayMethod) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage())
        try{
            const response = await authAxios.post(PayMethodEndpoint.newPayMethod(), item);
            const items: IPayMethod[] = [...getState().payMethod.payMethodItems]
            items.push({...item, id: response.data['id']})
            dispatch(fetchSuccess(items))
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось добавить новую запись!'))
            throw e
        }
    }
}

/**
 * Изменения записи
 * @param item
 */
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
