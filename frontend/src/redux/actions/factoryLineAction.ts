import {hideInfoMessage, showInfoMessage} from "./infoAction"
import {
    FACTORY_CLEAR_ERROR,
    FACTORY_LINE_DELETE_OK,
    FACTORY_LINE_LOAD_FINISH, FACTORY_LINE_LOAD_ITEM,
    FACTORY_LINE_LOAD_START,
    FACTORY_LINE_LOAD_SUCCESS, FACTORY_LINE_UPDATE
} from "./types"
import {IFactoryLine} from "types/model/factorylines"
import FactoryLineEndpoint from "services/endpoints/FactoryLineEndpoint"
import {NEW_RECORD_VALUE} from "../../utils/AppConst"
import authAxios from "../../services/axios-api"
import {capitalize} from "@material-ui/core";

/**
 * Загрузить список линий производства
 */
export function loadFactoryLines(search?: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        try {
            const url = FactoryLineEndpoint.getFactoryLinesList(search);
            const items: IFactoryLine[] = [];
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
 * Удалить линию производства по коду
 * @param id Код записи
 */
export function deleteFactoryItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await authAxios.delete(FactoryLineEndpoint.deleteFactoryLine(id));
            if (response.status === 204) {
                const items = [...getState().factoryLine.lineItems];
                const index = items.findIndex((elem)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
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
 * Загрузить объект произв. линии
 * @param id Код записи
 */
export function loadFactoryItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let item: IFactoryLine = {id: 0, name: ''};
        if (id===NEW_RECORD_VALUE){
            dispatch(getItemSuccess(item))
        }else{
            dispatch(fetchStart());
            try{
                const response = await authAxios.get(FactoryLineEndpoint.getFactoryLineItem(id));
                const item = response.data
                dispatch(getItemSuccess(item))
            }catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
            dispatch(fetchFinish())
        }
    }
}

export function changeFactoryItem(item: IFactoryLine) {
    return{
        type: FACTORY_LINE_UPDATE,
        item: item
    }
}

/**
 * Добавить новый элемент линии производства
 * @param item
 */
export function addNewFactoryItem(item: IFactoryLine) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const newItem = {...item, name: capitalize(item.name)}
            const response = await authAxios.post(FactoryLineEndpoint.newFactoryLine(), newItem);
            const items = [...getState().factoryLine.lineItems]
            items.push(response.data)
            await dispatch(fetchSuccess(items))
            return Promise.resolve();
        }
        catch (e) {
            console.log('Error save new record factory line. Error message:', e.response)
            const  errorMessage = `Не удалось добавить новое запись по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

/**
 * Сохранить изменения в модели
 * @param item Объект произв. линии
 */
export function updateFactoryItem(item: IFactoryLine) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(FactoryLineEndpoint.saveFactoryLine(item.id), item);
            const items = [...getState().factoryLine.lineItems]
            const index = items.findIndex(value => value.id === item.id)
            items[index] = item
            dispatch(fetchSuccess(items))
        }catch (e) {
            console.log('Error save new record factory line. Error message:', e.response)
            const  errorMessage = `Не удалось добавить новое запись по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

function getItemSuccess(item: IFactoryLine){
    return{
        type: FACTORY_LINE_LOAD_ITEM,
        item: item
    }
}

function deleteOk(items: IFactoryLine[]) {
    return{
        type: FACTORY_LINE_DELETE_OK,
        items: items
    }
}

function fetchStart() {
    return{
        type: FACTORY_LINE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: FACTORY_LINE_LOAD_FINISH
    }
}

function fetchSuccess(items: IFactoryLine[]) {
    return{
        type: FACTORY_LINE_LOAD_SUCCESS,
        items: items
    }
}

function clearError() {
    return{
        type: FACTORY_CLEAR_ERROR
    }
}
