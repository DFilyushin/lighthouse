import StoreEndpoint from "services/endpoints/StoreEndpoint";
import axios from "axios";
import {IStoreJournal, IStoreProduct, IStoreRaw} from "../../types/model/store";
import {
    STORE_CLEAR_ERROR,
    STORE_LOAD_FINISH,
    STORE_LOAD_PRODUCT_SUCCESS,
    STORE_LOAD_RAW_SUCCESS,
    STORE_LOAD_START,
    STORE_SET_ERROR,
    STORE_JOURNAL_SUCCESS
} from "./types";


/**
 * Загрузить актуальное состояние склада сырья
 */
export function loadRawStore() {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreRaw[] = [];
        dispatch(fetchStart());
        try{
            const dateStore = getState().store.rawStoreOnDate;
            console.log('state', getState().store);
            const url = StoreEndpoint.getStoreRaw(dateStore);
            console.log('url', url);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccessRawStore(itemList))
        }catch (e) {
            if (e.response) {
                console.log(e.response)
                dispatch(fetchError(`Ошибка загрузки списка! Сообщение: ${e.response.statusText}`))
            }else{
                dispatch(fetchError(`Ошибка загрузки списка!`))
            }
        }
        dispatch(fetchFinish())
    }
}

export function loadProductStore() {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreRaw[] = [];
        dispatch(fetchStart());
        try{
            const dateStore = getState().store.rawStoreOnDate;
            console.log('state', getState().store);
            const url = StoreEndpoint.getStoreProduct(dateStore);
            console.log('url', url);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccessProductStore(itemList))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки списка!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить журнал складских операций
 */
export function loadStoreJournal(date1: string, date2: string, operType: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreJournal[] = [];
        dispatch(fetchStart());
        try{
            const url = StoreEndpoint.getStoreJournal(date1.slice(0,10), date2.slice(0, 10), operType);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                const item: IStoreJournal = {
                    id: response.data[key]['id'],
                    count: response.data[key]['value'],
                    date: response.data[key]['date'],
                    tare: response.data[key]['tareId'],
                    name: response.data[key]['materialId']['name'],
                    type: response.data[key]['type'],
                    employee: response.data[key]['employee'],
                    price: response.data[key]['price'],
                    total: 0,
                    factoryId: response.data[key]['factoryId']
                }
                itemList.push(item)
            });
            dispatch(fetchSuccessJournal(itemList))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки журнала!'))
        }
        dispatch(fetchFinish())
    }
}

function fetchSuccessJournal(items: IStoreJournal[]) {
    return{
        type: STORE_JOURNAL_SUCCESS,
        items
    }
}

function fetchStart() {
    return{
        type: STORE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: STORE_LOAD_FINISH
    }
}

function fetchSuccessRawStore(items: IStoreRaw[]) {
    return{
        type: STORE_LOAD_RAW_SUCCESS,
        items
    }
}

function fetchSuccessProductStore(items: IStoreProduct[]) {
    return{
        type: STORE_LOAD_PRODUCT_SUCCESS,
        items
    }
}

function fetchError(error: string) {
    return{
        type: STORE_SET_ERROR,
        error
    }
}

export function clearStoreError() {
    return{
        type: STORE_CLEAR_ERROR
    }
}
