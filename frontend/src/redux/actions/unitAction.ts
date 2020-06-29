import {hideInfoMessage, showInfoMessage} from "./infoAction";
import UnitEndpoint from "services/endpoints/UnitEndpoint";
import axios from "axios";
import {IUnit} from "../../types/model/unit";
import {
    UNIT_SET_ERROR,
    UNIT_DELETE_OK,
    UNIT_ITEM_SUCCESS,
    UNIT_LOAD_FINISH,
    UNIT_LOAD_START,
    UNIT_LOAD_SUCCESS,
    UNIT_UPDATE_OBJECT
} from "./types";
import {clearError} from "./rawAction";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";

//FIXME После обновления, добавления, удаления записей обновить глобальный объект списка

/**
 * Загрузить список ед. изм.
 * @param search строка поиска
 * @param limit ограничение вывода
 * @param offset сдвиг
 */
export function loadUnit(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        // const tareInLocalStorage = localStorage.getItem(LS_TARE_KEY);
        // if (tareInLocalStorage){
        //     const tareList = JSON.parse(tareInLocalStorage);
        //     dispatch(fetchSuccess(tareList))
        //
        // }else {
        try {
            const url = UnitEndpoint.getUnits(search, limit, offset);
            const unitList: IUnit[] = [];
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                unitList.push({
                    id: response.data[key]['id'],
                    name: response.data[key]['name']
                })
            });
            // localStorage.setItem(LS_TARE_KEY, JSON.stringify(tareList))
            dispatch(fetchSuccess(unitList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        // }
        dispatch(fetchFinish())
    }
}


/**
 * Удалить запись
 * @param id код записи
 */
export function deleteItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(UnitEndpoint.deleteUnit(id));
            if (response.status === 204) {
                const items = [...getState().unit.unitItems];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
                //localStorage.removeItem(LS_TARE_KEY)
                dispatch(showInfoMessage('info', 'Запись успешно удалена'))
            }
            else {
                dispatch(showInfoMessage('error', `Неизвестная ошибка при удалении: ${response.status.toString()}`))
            }
        }catch (e) {
            dispatch(showInfoMessage('error', `Не удалось удалить запись ${e.toString()}!`))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить един. изм. по коду
 * @param id код записи
 */
export function loadUnitItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let item: IUnit = {id: 0, name: ''};
        if (id === NEW_RECORD_VALUE) {
            dispatch(getItemSuccess(item))
        }else{
            dispatch(fetchStart());
            try{
                const response = await axios.get(UnitEndpoint.getUnitItem(id));
                item.id = response.data['id'];
                item.name = response.data['name'];
                dispatch(getItemSuccess(item))
            }catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
            dispatch(fetchFinish())
        }
    }
}

/**
 * Добавить новую ед. измерения
 * @param item
 */
export function addNewUnit(item: IUnit) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            await axios.post(UnitEndpoint.newUnit(), item);
            dispatch(getItemSuccess(item))
        }catch (e) {
            dispatch(saveError('Не удалось добавить новую запись!'))
        }
    }
}

/**
 * Обновить запись
 * @param item объект ед. изм
 */
export function updateUnit(item: IUnit) {
    return async (dispatch: any, getState: any) => {
        try{
            await axios.put(UnitEndpoint.saveUnit(item.id), item);
        }catch (e) {
            dispatch(saveError(e.toString()))
        }
    }
}


function saveError(e: string) {
    return{
        type: UNIT_SET_ERROR,
        error: e
    }
}

export function changeUnit(item: IUnit) {
    return {
        type: UNIT_UPDATE_OBJECT,
        item: item
    }
}

function fetchStart() {
    return{
        type: UNIT_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: UNIT_LOAD_FINISH
    }
}

function fetchSuccess(items: IUnit[]) {
    return{
        type: UNIT_LOAD_SUCCESS,
        items
    }
}

function deleteOk(items:IUnit[]) {
    return{
        type: UNIT_DELETE_OK,
        items
    }
}

function getItemSuccess(item: IUnit) {
    return{
        type: UNIT_ITEM_SUCCESS,
        item
    }
}