import {hideInfoMessage, showInfoMessage} from "./infoAction"
import CostEndpoint from "services/endpoints/CostEndpoint"
import {ICost, ICostSimple} from "types/model/cost"
import {
    COST_CHANGE_ITEM,
    COST_CLEAR_ERROR,
    COST_LOAD_FINISH,
    COST_LOAD_FLAT_SUCCESS,
    COST_LOAD_ITEM_SUCCESS,
    COST_LOAD_PARENT_ITEMS,
    COST_LOAD_START,
    COST_LOAD_SUCCESS,
    COST_SAVE_OK
} from "./types"
import {NEW_RECORD_VALUE} from "utils/AppConst"
import authAxios from "../../services/axios-api"


/**
 * Загрузить список видов затрат
 */
export function getCostList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        try {
            const url = CostEndpoint.getCostList();
            const items: ICost[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchSuccess(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить список статей затрат без статей прихода сырья
 */
export function getFlatCostList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        dispatch(hideInfoMessage());
        try {
            const url = CostEndpoint.getCostFlatList();
            const items: ICostSimple[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchFlatSuccess(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Получить элемент статьи затрат
 * @param id
 */
export function getCostItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let item: ICost = {id: 0, name: "", childs: [], parent: 0};
        if (id === NEW_RECORD_VALUE) {
            dispatch(fetchItemSuccess(item))
            return undefined
        }
        dispatch(fetchStart());
        try {
            const response = await authAxios.get(CostEndpoint.getCostItem(id))
            item = response.data
            dispatch(fetchItemSuccess(item))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Получить затраты первого уровня
 */
export function getFirstLevelCost() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        try {
            const url = CostEndpoint.getCostList();
            const items: ICostSimple[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key) => {
                items.push({id: response.data[key]['id'], name: response.data[key]['name']})
            });
            dispatch(fetchFirstLevelItems(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить запись статьи затрат
 * @param id Код записи
 */
export function deleteCostItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try {
            const response = await authAxios.delete(CostEndpoint.deleteCost(id));
            if (response.status === 204) {
                const items = [...getState().cost.items];
                items.forEach((item: ICost, index: number) => {
                    if (item.id === id) {
                        items.splice(index, 1)
                    } else {
                        if (item.childs.length > 0) {
                            const index = item.childs.findIndex((elem: ICost) => {
                                return elem.id === id
                            });
                            if (index > -1) item.childs.splice(index, 1);
                        }
                    }
                })
                dispatch(deleteOk(items));
                dispatch(showInfoMessage('info', 'Запись успешно удалена'))
            } else {
                dispatch(showInfoMessage('error', `Неизвестная ошибка при удалении: ${response.status.toString()}`))
            }
        } catch (e) {
            dispatch(showInfoMessage('error', `Не удалось удалить запись ${e.toString()}!`))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Добавить новую статью затрат
 * @param item
 */
export function addNewCost(item: ICost) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try {
            await authAxios.post(CostEndpoint.newCost(), item);
            dispatch(saveOk(item));
        } catch (e) {
            console.log('Error save new record cost. Error message:', e.response)
            const  errorMessage = `Не удалось добавить новую запись по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

/**
 * Обновление затраты
 * @param item Объект затрат
 */
export function updateCost(item: ICost) {
    return async (dispatch: any, getState: any) => {
        try {
            await authAxios.put(CostEndpoint.updateCost(item.id), item);
        } catch (e) {
            console.log('Error save cost record. Error message:', e.response)
            const  errorMessage = `Не удалось обновить данные по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}


export function changeCost(item: ICost) {
    return {
        type: COST_CHANGE_ITEM,
        item
    }
}

function clearError() {
    return {
        type: COST_CLEAR_ERROR
    }
}

function saveOk(item: ICost) {
    return {
        type: COST_SAVE_OK,
        item
    }
}

function deleteOk(items: ICost[]) {
    return {
        type: COST_LOAD_SUCCESS,
        items
    }
}

function fetchStart() {
    return {
        type: COST_LOAD_START
    }
}

function fetchItemSuccess(item: ICost) {
    return {
        type: COST_LOAD_ITEM_SUCCESS,
        item
    }
}

function fetchFinish() {
    return {
        type: COST_LOAD_FINISH
    }
}

function fetchSuccess(items: ICost[]) {
    return {
        type: COST_LOAD_SUCCESS,
        items
    }
}

function fetchFlatSuccess(items: ICostSimple[]) {
    return {
        type: COST_LOAD_FLAT_SUCCESS,
        items
    }
}

function fetchFirstLevelItems(items: ICostSimple[]) {
    return {
        type: COST_LOAD_PARENT_ITEMS,
        items
    }
}
