import StoreEndpoint from "services/endpoints/StoreEndpoint";
import axios from "axios";
import {IStoreProduct, IStoreRaw} from "../../types/model/store";
import {
    STORE_CLEAR_ERROR,
    STORE_LOAD_FINISH,
    STORE_LOAD_PRODUCT_SUCCESS,
    STORE_LOAD_RAW_SUCCESS,
    STORE_LOAD_START,
    STORE_SET_ERROR
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