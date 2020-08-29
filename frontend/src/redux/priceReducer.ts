import {IPriceState} from "../types/state/price"
import {nullPrice} from "../types/model/price"
import {
    PRICE_CHANGE_ITEM,
    PRICE_DELETE_OK, PRICE_LOAD_BY_EMPLOYEE_SUCCESS,
    PRICE_LOAD_FINISH, PRICE_LOAD_HISTORY_SUCCESS, PRICE_LOAD_ITEM_SUCCESS,
    PRICE_LOAD_START,
    PRICE_LOAD_SUCCESS
} from "./actions/types"

const initialState = (): IPriceState => ({
    priceList: [],
    priceListHistory: [],
    priceItem: {...nullPrice},
    error: '',
    hasError: false,
    isLoading: false
})

export const priceReducer = (state: IPriceState = initialState(), action: any) => {
    switch (action.type) {
        case PRICE_LOAD_START:
            return {...state, isLoading: true}
        case PRICE_LOAD_FINISH:
            return {...state, isLoading: false}
        case PRICE_LOAD_SUCCESS:
            return {...state, priceList: action.items}
        case PRICE_CHANGE_ITEM:
            return {...state, priceItem: action.item}
        case PRICE_DELETE_OK:
            return {...state, priceList: action.items}
        case PRICE_LOAD_ITEM_SUCCESS:
            return {...state, priceItem: action.item}
        case PRICE_LOAD_HISTORY_SUCCESS:
            return {...state, priceListHistory: action.items}
        case PRICE_LOAD_BY_EMPLOYEE_SUCCESS:
            return {...state, priceList: action.items}
        default:
            return state;
    }
}
