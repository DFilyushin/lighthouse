import {hideInfoMessage, showInfoMessage} from "./infoAction";
import authAxios from "../../services/axios-api";
import {
    PRICE_CHANGE_ITEM, PRICE_LOAD_BY_EMPLOYEE_SUCCESS,
    PRICE_LOAD_FINISH, PRICE_LOAD_HISTORY_SUCCESS,
    PRICE_LOAD_ITEM_SUCCESS,
    PRICE_LOAD_START,
    PRICE_LOAD_SUCCESS
} from "./types";
import {IPrice, nullPrice} from "../../types/model/price";
import PriceEndpoint from "../../services/endpoints/PriceEndpoint";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";


/**
 * Загрузить актуальный прайс-лист
 */
export function loadActualPriceList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        try {
            const url = PriceEndpoint.loadPriceList();
            const priceList: IPrice[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                priceList.push(response.data[key])
            });
            dispatch(fetchSuccess(priceList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить актуальный прайс-лист по выбранному менеджеру
 */
export function loadActualPriceListByEmployee(employeeId: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        try {
            const url = PriceEndpoint.loadPriceListByEmployee(employeeId);
            const priceList: IPrice[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                priceList.push(response.data[key])
            });
            dispatch(fetchEmployeePriceSuccess(priceList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить прайс-листы по коду продукции
 * @param productId Код продукции
 */
export function loadPriceListByProduct(productId: number) {
    return async(dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        try {
            const url = PriceEndpoint.loadPriceByProduct(productId);
            const priceList: IPrice[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                priceList.push(response.data[key])
            });
            dispatch(fetchLoadHistorySuccess(priceList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить прайс по коду
 * @param id Код записи
 */
export function loadPriceListById(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        dispatch(hideInfoMessage())
        if (id === NEW_RECORD_VALUE){
            dispatch(fetchItemSuccess({...nullPrice}))
        }else {
            try {
                const url = PriceEndpoint.loadPriceById(id)
                const response = await authAxios.get(url)
                const item: IPrice = response.data
                dispatch(fetchItemSuccess(item))
            }catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
    }
}

/**
 * Удалить прайс-лист
 * @param id Код записи
 */
export function deletePriceList(id: number) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.delete(PriceEndpoint.deletePriceList(id))
            const items = [...getState().price.priceList]
            const index = items.findIndex((elem)=>{return elem.id === id})
            items.splice(index, 1)
            dispatch(fetchSuccess(items))
            dispatch(showInfoMessage('info', 'Запись успешно удалена'))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Создать прайс-лист для сотрудника
 * @param employeeId Код сотрудника
 */
export function makePriceForEmployee(employeeId: number) {
    return async (dispatch: any, getState: any) => {
        try{
            const response = await authAxios.post(PriceEndpoint.newPriceListByTemplate(employeeId))
            if (response.status === 201) {
                dispatch(showInfoMessage('info', 'Прайс-лист успешно создан!'))
            }else{

            }
        }catch (e) {
            console.log('Error create price for employee.', e.toString())
            dispatch(showInfoMessage('error', 'Не удалось создать прайс-лист!'))
        }
    }
}

/**
 * Обновить прайс
 * @param item
 */
export function updatePrice(item: IPrice) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(PriceEndpoint.updatePriceList(item.id), item);
            return Promise.resolve();
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
            return Promise.reject();
        }
    }
}

/**
 * Новый прайс-лист
 * @param item Объект нового прайса
 */
export function newPriceList(item: IPrice) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.post(PriceEndpoint.newPriceList(), item)
            dispatch(loadActualPriceList())
            return Promise.resolve()
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
            return Promise.reject()
        }
    }
}

/**
 * Изменение записи
 * @param item Объект записи
 */
export function changePriceItem(item: IPrice) {
    return{
        type: PRICE_CHANGE_ITEM,
        item
    }
}

function fetchStart() {
    return{
        type: PRICE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: PRICE_LOAD_FINISH
    }
}

function fetchSuccess(items: IPrice[]) {
    return{
        type: PRICE_LOAD_SUCCESS,
        items
    }
}

function fetchEmployeePriceSuccess(items: IPrice[]) {
    return{
        type: PRICE_LOAD_BY_EMPLOYEE_SUCCESS,
        items
    }
}

function fetchItemSuccess(item: IPrice) {
    return{
        type: PRICE_LOAD_ITEM_SUCCESS,
        item
    }
}

function fetchLoadHistorySuccess(items: IPrice[]) {
    return{
        type: PRICE_LOAD_HISTORY_SUCCESS,
        items
    }
}
