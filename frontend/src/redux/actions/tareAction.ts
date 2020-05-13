import {hideInfoMessage, showInfoMessage} from "./infoAction";
import TareEndpoint from "services/endpoints/TareEndpoint";
import {ITare} from "../../types/model/tare";
import axios from "axios";
import {
    TARE_CLEAR_ERROR,
    TARE_DELETE_OK,
    TARE_ITEM_SUCCESS,
    TARE_LOAD_FINISH,
    TARE_LOAD_START,
    TARE_LOAD_SUCCESS,
    TARE_SET_ERROR,
    TARE_UPDATE_OBJECT
} from "./types";
import RawEndpoint from "../../services/endpoints/RawEndpoint";

const LS_TARE_KEY = 'tares'

export function loadTare(search?: string, limit?: number, offset?:number) {
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
                const url = TareEndpoint.getTareList(search, limit, offset);
                const tareList: ITare[] = [];
                const response = await axios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    tareList.push({
                        id: response.data[key]['id'],
                        name: response.data[key]['name'],
                        unit: response.data[key]['unit'],
                        idUnit: response.data[key]['unitId'],
                        v: response.data[key]['v']
                    })
                });
                // localStorage.setItem(LS_TARE_KEY, JSON.stringify(tareList))
                dispatch(fetchSuccess(tareList))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        // }
        dispatch(fetchFinish())
    }
}

export function loadTareItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let item: ITare = {id: 0, name: '', v:0, unit:'', idUnit: 0};
        dispatch(fetchStart());
        try{
            const response = await axios.get(TareEndpoint.getTareItem(id));
            item.id = response.data['id'];
            item.name = response.data['name'];
            item.unit = response.data['unit']
            item.v = response.data['v']
            item.idUnit = response.data['idUnit']
            console.log('check', item)
            dispatch(getItemSuccess(item))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

export function deleteTare(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(TareEndpoint.getDeleteTare(id));
            if (response.status === 204) {
                const items = [...getState().tare.tareItems];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
                localStorage.removeItem(LS_TARE_KEY)
                dispatch(showInfoMessage('info', 'Запись успешно удалена'))
            }
            else {
                dispatch(showInfoMessage('error', `Неизвестная ошибка при удалении: ${response.status.toString()}`))
            }
        }catch (e) {
            console.log(e.toString());
            dispatch(showInfoMessage('error', `Не удалось удалить запись ${e.toString()}!`))
        }
        dispatch(fetchFinish())
    }
}


export function changeTare(item: ITare) {
    return {
        type: TARE_UPDATE_OBJECT,
        item: item
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
            const response = await axios.post(TareEndpoint.newTare(), item);
            dispatch(getItemSuccess(item))
        }catch (e) {
            dispatch(saveError('Не удалось добавить новое сырьё!'))
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
            console.log('save', item)
            const response = await axios.put(TareEndpoint.updateTare(item.id), item);
            console.log(response.data);
        }catch (e) {
            console.log(e.toString())
            dispatch(saveError(e.toString()))
        }
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
