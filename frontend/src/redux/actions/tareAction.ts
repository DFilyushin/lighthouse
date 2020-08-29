import {hideInfoMessage, showInfoMessage} from "./infoAction"
import TareEndpoint from "services/endpoints/TareEndpoint"
import {ITare} from "types/model/tare"
import {
    TARE_CLEAR_ERROR,
    TARE_DELETE_OK,
    TARE_ITEM_SUCCESS,
    TARE_LOAD_FINISH,
    TARE_LOAD_START,
    TARE_LOAD_SUCCESS,
    TARE_OK_OPERATION,
    TARE_SET_ERROR,
    TARE_UPDATE_OBJECT
} from "./types"
import {NEW_RECORD_VALUE} from "utils/AppConst"
import authAxios from "../../services/axios-api"

const LS_TARE_KEY = 'tares'

/**
 * Загрузить список тары
 * @param search строка поиска
 * @param limit Лимит выбора записей
 * @param offset Сдвиг
 */
export function loadTare(search?: string, limit?: number, offset?:number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
            try {
                const url = TareEndpoint.getTareList(search, limit, offset);
                const tareList: ITare[] = [];
                const response = await authAxios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    tareList.push(response.data[key])
                });
                dispatch(fetchSuccess(tareList))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        // }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить объект тары
 * @param id Код записи
 */
export function loadTareItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let item: ITare = {id: 0, name: '', v:0, unit:'', idUnit: 0};
        if (id===NEW_RECORD_VALUE){
            dispatch(getItemSuccess(item))
        }else{
            dispatch(fetchStart());
            try{
                const response = await authAxios.get(TareEndpoint.getTareItem(id));
                item = response.data
                dispatch(getItemSuccess(item))
            }catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
            dispatch(fetchFinish())
        }
    }
}

/**
 * Удалить объект тары
 * @param id Код записи
 */
export function deleteTare(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await authAxios.delete(TareEndpoint.deleteTare(id));
            if (response.status === 204) {
                const items = [...getState().tare.tareItems];
                const index = items.findIndex((elem)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
                localStorage.removeItem(LS_TARE_KEY)
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


export function changeTare(item: ITare) {
    return {
        type: TARE_UPDATE_OBJECT,
        item
    }
}

/**
 * Добавить новую тары
 * @param item Объект тары
 */
export function addNewTare(item: ITare) {

    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            await authAxios.post(TareEndpoint.newTare(), item);
            dispatch(okOperation());
            return Promise.resolve();
        }
        catch (e) {
            dispatch(saveError('Не удалось добавить новую запись!'));
            return Promise.reject();
        }
    }
}

/**
 * Изменить тару
 * @param item объект Тары
 */
export function updateTare(item: ITare) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(TareEndpoint.saveTare(item.id), item);
        }catch (e) {
            dispatch(saveError(e.toString()))
        }
    }
}

function okOperation() {
    return{
        type: TARE_OK_OPERATION
    }
}

function clearError() {
    return{
        type: TARE_CLEAR_ERROR
    }

}
function saveError(e: string) {
    return{
        type: TARE_SET_ERROR,
        error: e
    }
}

function fetchStart() {
    return{
        type: TARE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: TARE_LOAD_FINISH
    }
}

function getItemSuccess(item: ITare) {
    return{
        type: TARE_ITEM_SUCCESS,
        item
    }
}

function fetchSuccess(items: ITare[]) {
    return{
        type: TARE_LOAD_SUCCESS,
        items
    }
}

function deleteOk(items: ITare[]) {
    return{
        type: TARE_DELETE_OK,
        items
    }
}
