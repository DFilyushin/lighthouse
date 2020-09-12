import {IStoreState} from 'types/state/store'
import {
    STORE_CHANGE_ITEM,
    STORE_CLEAR_ERROR,
    STORE_ITEM_MOVEMENT_CHANGE,
    STORE_ITEM_MOVEMENT_DELETE,
    STORE_JOURNAL_ITEM_SUCCESS,
    STORE_JOURNAL_SUCCESS,
    STORE_LOAD_FINISH,
    STORE_LOAD_PRODUCT_SUCCESS,
    STORE_LOAD_RAW_SUCCESS,
    STORE_LOAD_START,
    STORE_NEW_MOVEMENT,
    STORE_NEW_MOVEMENT_ITEM,
    STORE_SET_DATE_PRODUCT_STORE,
    STORE_SET_DATE_RAW_STORE,
    STORE_SET_ERROR,
    STORE_RESERVE_LOAD_SUCCESS,
    STORE_RESERVE_ITEM_LOAD_SUCCESS, STORE_RESERVE_NEW_ITEM, STORE_RESERVE_LOAD_ITEM_SUCCESS, STORE_RESERVE_CHANGE_ITEM
} from "./actions/types";
import {nullStoreItem, nullStoreReserveProduct} from "../types/model/store";
import {nullEmployeeItem} from "../types/model/employee";

const initState = (): IStoreState => ({
    rawStoreOnDate: (new Date()).toISOString().slice(0, 10), // состояние склада сырья на дату
    productStoreOnDate: (new Date()).toISOString().slice(0, 10), // состояние склада готовой продукции на дату
    journalStartDate: (new Date()).toISOString().slice(0, 10),
    journalEndDate: (new Date()).toISOString().slice(0, 10),
    storeJournalItem: {...nullStoreItem},
    storeMovement: {date: (new Date()).toISOString().slice(0, 10), employee: {...nullEmployeeItem}, comment: '', items: []},
    storeReservedList: [],
    storeReserveItem: {...nullStoreReserveProduct},
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
        case STORE_CHANGE_ITEM:
            return {...state, storeJournalItem: action.item}
        case STORE_NEW_MOVEMENT:
            return {...state, storeMovement: action.item}
        case STORE_NEW_MOVEMENT_ITEM:
            return {...state, storeMovement: action.item}
        case STORE_ITEM_MOVEMENT_CHANGE:
            return {...state, storeMovement: action.item}
        case STORE_ITEM_MOVEMENT_DELETE:
            return {...state, storeMovement: action.item}
        case STORE_RESERVE_ITEM_LOAD_SUCCESS:
            return {...state, storeReserveItem: action.item}
        case STORE_RESERVE_LOAD_SUCCESS:
            return {...state, storeReservedList: action.items}
        case STORE_RESERVE_NEW_ITEM:
            return {...state, storeReserveItem: action.item}
        case STORE_RESERVE_LOAD_ITEM_SUCCESS:
            return {...state, storeReserveItem: action.item}
        case STORE_RESERVE_CHANGE_ITEM:
            return {...state, storeReserveItem: action.item}
        default:
            return state
    }
}
