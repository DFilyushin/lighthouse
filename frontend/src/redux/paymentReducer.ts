import {IPaymentState} from "../types/state/payment";
import {nullPaymentItem} from "../types/model/payment";
import {
    PAYMENT_CHANGE_ITEM,
    PAYMENT_DELETE_OK,
    PAYMENT_LOAD_FINISH,
    PAYMENT_LOAD_START,
    PAYMENT_SUCCESS,
    PAYMENT_SUCCESS_ITEM
} from "./actions/types";


const initialState = () : IPaymentState => ({
    paymentItems: [],
    paymentItem: {...nullPaymentItem},
    hasError: false,
    isLoading: false,
    error: ''
})

export const paymentReducer = (state: IPaymentState = initialState(), action: any) => {
    switch (action.type) {
        case PAYMENT_LOAD_START:
            return {...state, isLoading: true}
        case PAYMENT_LOAD_FINISH:
            return {...state, isLoading: false}
        case PAYMENT_SUCCESS:
            return {...state, paymentItems: action.items}
        case PAYMENT_SUCCESS_ITEM:
            return {...state, paymentItem: action.item}
        case PAYMENT_DELETE_OK:
            return {...state, paymentItems: action.items}
        case PAYMENT_CHANGE_ITEM:
            return {...state, paymentItem: action.item}
        default: return state
    }
}