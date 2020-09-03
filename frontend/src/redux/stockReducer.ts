import {IStock} from "../types/model/stock";
import {
    STOCK_CLEAR_ERROR,
    STOCK_DELETE_OK,
    STOCK_LOAD_ERROR,
    STOCK_LOAD_FINISH,
    STOCK_LOAD_START,
    STOCK_LOAD_SUCCESS,
    STOCK_LOAD_SUCCESS_ITEM,
    STOCK_UPDATE_OBJECT
} from "./actions/types";
import {IStockState} from "../types/state/stock";


const nullStock: IStock = {
    id: 0,
    name: ''
}
const initialState = (): IStockState => ({
    stocks: [],
    stockItem: nullStock,
    isLoading: false,
    error: '',
    hasError: false
});


export const stockReducer = (state = initialState(), action: any) => {
    switch (action.type) {
        case STOCK_LOAD_SUCCESS:
            return {...state, stocks: action.items};
        case STOCK_LOAD_ERROR:
            return {...state, error: action.error, typeMessage: 'error', hasError: action.hasError};
        case STOCK_LOAD_START:
            return {...state, isLoading: true};
        case STOCK_LOAD_FINISH:
            return {...state, isLoading: false};
        case STOCK_LOAD_SUCCESS_ITEM:
            return {...state, stockItem: action.item};
        case STOCK_UPDATE_OBJECT:
            return {...state, stockItem: action.item};
        case STOCK_DELETE_OK:
            return {...state, stocks: action.items, typeMessage: 'success'};
        case STOCK_CLEAR_ERROR:
            return {...state, error: '', hasError: false, typeMessage: ''};
        default: return state
    }
};