import {IPayMethodState} from "../types/state/paymethod";
import {nullPayMethod} from "../types/model/paymethod";
import {
    PAY_METHOD_LOAD_FINISH,
    PAY_METHOD_LOAD_START,
    PAY_METHOD_SUCCESS,
    PAY_METHOD_SUCCESS_ITEM
} from "./actions/types";


const initialState = (): IPayMethodState => ({
    payMethodItems: [],
    payMethodItem: nullPayMethod,
    error: '',
    hasError: false,
    isLoading: false
})

export const payMethodReducer = (state: IPayMethodState = initialState(), action: any) => {
    switch (action.type) {
        case PAY_METHOD_LOAD_START:
            return {...state, isLoading: true}
        case PAY_METHOD_LOAD_FINISH:
            return {...state, isLoading: false}
        case PAY_METHOD_SUCCESS:
            return {...state, payMethodItems: action.items}
        case PAY_METHOD_SUCCESS_ITEM:
            return {...state, payMethodItem: action.item}
        default: return state
    }
}