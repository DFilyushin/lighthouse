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
    STORE_RESERVE_ITEM_LOAD_SUCCESS,
    STORE_RESERVE_NEW_ITEM,
    STORE_RESERVE_LOAD_ITEM_SUCCESS,
    STORE_RESERVE_CHANGE_ITEM,
    STORE_JOURNAL_MATERIAL_SUCCESS,
    STORE_LOAD_STOCK_SUCCESS, STORE_RETURNS_LOAD_ITEM_SUCCESS
} from "./actions/types";
import {nullStoreItem, nullStoreReserveProduct} from "../types/model/store";
import {nullEmployeeItem} from "../types/model/employee";
import {getCurrentDate} from "../utils/AppUtils";
import {nullContractListItemSimple} from "../types/model/contract";
import {nullProduct} from "../types/model/product";
import {nullTare} from "../types/model/tare";

const initState = (): IStoreState => ({
    rawStoreOnDate: getCurrentDate(), // состояние склада сырья на дату
    productStoreOnDate: getCurrentDate(), // состояние склада готовой продукции на дату
    stockStoreOnDate: getCurrentDate(), // состояние склада ТМЦ на дату
    journalStartDate: getCurrentDate(),
    journalEndDate: getCurrentDate(),
    storeJournalItem: {...nullStoreItem},
    storeMovement: {date: getCurrentDate(), employee: {...nullEmployeeItem}, comment: '', items: []},
    storeReservedList: [],
    storeReserveItem: {...nullStoreReserveProduct},
    rawStore: [], // склад сырья
    stockStore: [], // склад ТМЦ
    productStore: [], // склад СГП
    reservedProduct: [],
    storeJournal: [],
    storeMaterialJournal: [],
    storeReturnItem: {
        id: 0,
        contract: {...nullContractListItemSimple},
        count: 0,
        date: '',
        product: {...nullProduct},
        tare: {...nullTare},
        returnCause: '',
        returnValue: 0,
        total: 0
    },
    isLoading: false,
    error: '',
    hasError: false
});


export const storeReducer = (state: IStoreState = initState(), action: any) => {
    switch (action.type) {
        case STORE_LOAD_START:
            return {...state, isLoading: true}
        case STORE_LOAD_FINISH:
            return {...state, isLoading: false}
        case STORE_LOAD_RAW_SUCCESS:
            return {...state, rawStore: action.items}
        case STORE_LOAD_PRODUCT_SUCCESS:
            return {...state, productStore: action.items}
        case STORE_LOAD_STOCK_SUCCESS:
            return {...state, stockStore: action.items}
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
        case STORE_JOURNAL_MATERIAL_SUCCESS:
            return {...state, storeMaterialJournal: action.items}
        case STORE_RETURNS_LOAD_ITEM_SUCCESS:
            return {...state, storeReturnItem: action.item}
        default:
            return state
    }
}
