import axios from "axios";
import {hideInfoMessage, showInfoMessage} from "./infoAction";
import {
    FACTORY_CLEAR_ERROR,
    FACTORY_LINE_DELETE_OK,
    FACTORY_LINE_LOAD_FINISH, FACTORY_LINE_LOAD_ITEM,
    FACTORY_LINE_LOAD_START,
    FACTORY_LINE_LOAD_SUCCESS, FACTORY_LINE_SET_ERROR, FACTORY_LINE_UPDATE
} from "./types";
import {IFactoryLine} from "types/model/factorylines";
import FactoryLineEndpoint from "services/endpoints/FactoryLineEndpoint";

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
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push({
                    id: response.data[key]['id'],
                    name: response.data[key]['name']
                })
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
            const response = await axios.delete(FactoryLineEndpoint.deleteFactoryLine(id));
            if (response.status === 204) {
                const items = [...getState().factoryLine.items];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
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
        if (id===0){
            dispatch(getItemSuccess(item))
        }else{
            dispatch(fetchStart());
            try{
                const response = await axios.get(FactoryLineEndpoint.getFactoryLineItem(id));
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

export function changeFactoryItem(item: IFactoryLine) {
    return{
        type: FACTORY_LINE_UPDATE,
        item: item
    }
}

export function addNewFactoryItem(item: IFactoryLine) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            await axios.post(FactoryLineEndpoint.newFactoryLine(), item);
            //dispatch(okOperation());
            return Promise.resolve();
        }
        catch (e) {
            dispatch(saveError('Не удалось добавить новую запись!'));
            return Promise.reject();
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
            const response = await axios.put(FactoryLineEndpoint.saveFactoryLine(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
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

function saveError(error: string) {
    return{
        type: FACTORY_LINE_SET_ERROR,
        error: error
    }
}