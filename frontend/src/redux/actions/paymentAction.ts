import {
    PAYMENT_DELETE_OK,
    PAYMENT_LOAD_FINISH,
    PAYMENT_LOAD_START,
    PAYMENT_SUCCESS,
    PAYMENT_SUCCESS_ITEM
} from "./types";
import {IPaymentItem, IPaymentListItem} from "../../types/model/payment";
import {hideInfoMessage, showInfoMessage} from "./infoAction";
import axios from "axios";
import PaymentEndpoint from "../../services/endpoints/PaymentEndpoint";
import PayMethodEndpoint from "../../services/endpoints/PayMethodEndpoint";


/**
 * Загрузить список оплат за период
 * @param startDate Начальная дата
 * @param endDate Конечная дата
 * @param method Метод оплаты
 */
export function loadPaymentList(startDate: string, endDate: string, method?: number) {
    return async (dispatch: any, getState: any)=> {
        dispatch(loadStart())
        dispatch(hideInfoMessage())
        const url = PaymentEndpoint.getPaymentList(startDate, endDate, method)
        const items: IPaymentListItem[] = []
        try{
            const response = await axios.get(url)
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

export function deletePayment(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage())
        try{
            const response = await axios.delete(PaymentEndpoint.deletePayment(id));
            if (response.status === 204) {
                const items = [...getState().payment.paymentItems];
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

    }
}


export function loadPaymentItem(id: number) {
    return async (dispatch: any, getState: any) => {

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

