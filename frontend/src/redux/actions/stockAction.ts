import {
    STOCK_CLEAR_ERROR,
    STOCK_DELETE_OK,
    STOCK_LOAD_ERROR,
    STOCK_LOAD_FINISH,
    STOCK_LOAD_START,
    STOCK_LOAD_SUCCESS,
    STOCK_LOAD_SUCCESS_ITEM,
    STOCK_UPDATE_OBJECT
} from "./types";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";
import authAxios from "../../services/axios-api";
import {showInfoMessage} from "./infoAction";
import {IStock} from "../../types/model/stock";
import StockEndpoint from "../../services/endpoints/StockEndpoint";

//FIXME Вынести управление ошибками и сообщениями в стор ошибок


/**
 * Загрузить список ТМЗ
 * @param search поисковая строка
 * @param limit лимит вывода
 * @param offset сдвиг
 */
export function loadStockList(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStock[] = [];
        dispatch(fetchStart());
        try{
            const url = StockEndpoint.getStockList(search, limit, offset);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccess(itemList))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки списка!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить ТМЗ
 * @param id Код ТМЗ
 */
export function deleteStock(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await authAxios.delete(StockEndpoint.deleteStock(id));
            if (response.status === 204) {
                const items = [...getState().stock.stocks];
                const index = items.findIndex((elem)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
            }
            else {
                dispatch(fetchError('Не удалось удалить ТМЗ!'))
            }
        }catch (e) {
            dispatch(fetchError('Не удалось удалить ТМЗ!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить ТМЗ по коду
 * @param id Код сырья
 */
export function loadStockItem(id: number){
    return async (dispatch: any, getState: any) => {
        const stock: IStock = {id: 0, name: ""};
        dispatch(fetchStart());
        if (id === NEW_RECORD_VALUE){
            dispatch(stockLoadItemSuccess(stock))
        }else {

            try {
                const response = await authAxios.get(StockEndpoint.getStockItem(id));
                const stock = response.data;
                dispatch(stockLoadItemSuccess(stock))
            } catch (e) {
                dispatch(fetchError(e))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Добавить новое сырьё
 * @param stock Объект сырья
 */
export function addNewStock(stock: IStock) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const response = await authAxios.post(StockEndpoint.newStock(), stock);
            const items = [...getState().stock.stocks]
            items.push(response.data)
            items.sort(function (a, b) {
                const nameA=a.name.toLowerCase()
                const nameB=b.name.toLowerCase()
                if (nameA < nameB) //сортируем строки по возрастанию
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 // Никакой сортировки
            })
            dispatch(fetchSuccess(items))
        }catch (e) {
            console.log('Error save new record stock. Error message:', e.response)
            const  errorMessage = `Не удалось добавить новое сырьё по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

export function changeStock(stock: IStock) {
    return {
        type: STOCK_UPDATE_OBJECT,
        item: stock
    }
}

/**
 * Сохранить изменения
 * @param stock Объект сырья
 */
export function updateStock(stock: IStock) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(StockEndpoint.saveStock(stock.id), stock);
            const items = [...getState().stock.stocks]
            const index = items.findIndex(value => value.id === stock.id)
            items[index] = stock
            dispatch(fetchSuccess(items))
        }catch (e) {
            console.log('Error save stock record. Error message:', e.response)
            const  errorMessage = `Не удалось сохранить изменения по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}


export function clearError() {
    return{
        type: STOCK_CLEAR_ERROR
    }
}
function fetchStart() {
    return {
        type: STOCK_LOAD_START
    }
}

function deleteOk(items: IStock[]) {
    return{
        type: STOCK_DELETE_OK,
        items
    }
}

function fetchFinish() {
    return {
        type: STOCK_LOAD_FINISH
    }
}

function fetchError(error: string) {
    return{
        type: STOCK_LOAD_ERROR,
        error: error
    }
}

function fetchSuccess(items: IStock[]) {
    return{
        type: STOCK_LOAD_SUCCESS,
        items
    }
}

function stockLoadItemSuccess(item: IStock) {
    return{
        type: STOCK_LOAD_SUCCESS_ITEM,
        item
    }
}
