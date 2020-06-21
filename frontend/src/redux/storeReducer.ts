import {IStoreState} from 'types/state/store'
import {
    STORE_LOAD_FINISH,
    STORE_LOAD_PRODUCT_SUCCESS,
    STORE_LOAD_RAW_SUCCESS,
    STORE_LOAD_START,
    STORE_SET_DATE_PRODUCT_STORE,
    STORE_SET_DATE_RAW_STORE
} from "./actions/types";

const initState = (): IStoreState => ({
    rawStoreOnDate: (new Date()).toISOString().slice(0, 10), // состояние склада сырья на дату
    productStoreOnDate: (new Date()).toISOString().slice(0, 10), // состояние склада готовой продукции на дату
    rawStore: [],
    productStore: [],
    reservedProduct: [],
    isLoading: false,
    error: '',
    hasError: false
});


export const storeReducer = (state: IStoreState=initState(), action: any) => {
    switch (action.type) {
        case STORE_LOAD_START:
            return {...state, isLoading: true}
        case STORE_LOAD_FINISH:
            return {...state, isLoading: false}
        case STORE_LOAD_RAW_SUCCESS:
            return {...state, rawStore: action.items}
        case STORE_LOAD_PRODUCT_SUCCESS:
            return {...state, productStore: action.items}
        case STORE_SET_DATE_RAW_STORE:
            return {...state, rawStoreOnDate: action.date}
        case STORE_SET_DATE_PRODUCT_STORE:
            return {...state, productStoreOnDate: action.date}
        default:
            return state
    }
}
