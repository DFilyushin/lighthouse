import {IStoreState} from 'types/state/store'
import {
    STORE_CLEAR_ERROR, STORE_JOURNAL_ITEM_SUCCESS, STORE_JOURNAL_SUCCESS,
    STORE_LOAD_FINISH,
    STORE_LOAD_PRODUCT_SUCCESS,
    STORE_LOAD_RAW_SUCCESS,
    STORE_LOAD_START,
    STORE_SET_DATE_PRODUCT_STORE,
    STORE_SET_DATE_RAW_STORE, STORE_SET_ERROR
} from "./actions/types";
import {nullStoreItem} from "../types/model/store";

const initState = (): IStoreState => ({
    rawStoreOnDate: (new Date()).toISOString().slice(0, 10), // состояние склада сырья на дату
    productStoreOnDate: (new Date()).toISOString().slice(0, 10), // состояние склада готовой продукции на дату
    journalStartDate: (new Date()).toISOString().slice(0, 10),
    journalEndDate: (new Date()).toISOString().slice(0, 10),
    storeJournalItem: {...nullStoreItem},
    rawStore: [],
    productStore: [],
    reservedProduct: [],
    storeJournal: [],
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
        case STORE_SET_ERROR:
            return {...state, hasError: true, error: action.error}
        case STORE_CLEAR_ERROR:
            return {...state, hasError: false, error: ''}
        case STORE_JOURNAL_SUCCESS:
            return {...state, storeJournal: action.items}
        case STORE_JOURNAL_ITEM_SUCCESS:
            return {...state, storeJournalItem: action.item}
        default:
            return state
    }
}
