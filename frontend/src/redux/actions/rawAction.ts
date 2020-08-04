import RawEndpoint from "services/endpoints/RawEndpoint"
import {IRaw} from 'types/model/raw'
import {
    RAW_CLEAR_ERROR,
    RAW_DELETE_OK,
    RAW_LOAD_ERROR,
    RAW_LOAD_FINISH,
    RAW_LOAD_START,
    RAW_LOAD_SUCCESS,
    RAW_LOAD_SUCCESS_ITEM,
    RAW_UPDATE_OBJECT
} from "./types";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";
import authAxios from "../../services/axios-api";

//FIXME При добавлении и удалении не обновляется результирующий стор
//FIXME Вынести управление ошибками и сообщениями в стор ошибок
/**
 * Загрузить список продукции
 * @param search поисковая строка
 * @param limit лимит вывода
 * @param offset сдвиг
 */
export function loadRaws(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: IRaw[] = [];
        dispatch(fetchStart());
        try{
            const url = RawEndpoint.getRawList(search, limit, offset);
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
 * Удалить сырьё
 * @param id Код продукта
 */
export function deleteRaw(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await authAxios.delete(RawEndpoint.deleteRaw(id));
            if (response.status === 204) {
                const items = [...getState().raw.raws];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
            }
            else {
                dispatch(fetchError('Не удалось удалить сырьё!'))
            }
        }catch (e) {
            dispatch(fetchError('Не удалось удалить сырьё!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить сырьё по коду
 * @param id Код сырья
 */
export function loadRawItem(id: number){
    return async (dispatch: any, getState: any) => {
        const raw: IRaw = {id: 0, name: ""};
        dispatch(fetchStart());
        if (id === NEW_RECORD_VALUE){
            console.log(raw)
            dispatch(rawLoadItemSuccess(raw))
        }else {

            try {
                const response = await authAxios.get(RawEndpoint.getRawItem(id));
                const raw = response.data;
                dispatch(rawLoadItemSuccess(raw))
            } catch (e) {
                dispatch(fetchError(e))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Добавить новое сырьё
 * @param raw Объект сырья
 */
export function addNewRaw(raw: IRaw) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const response = await authAxios.post(RawEndpoint.newRaw(), raw);
            const items = [...getState().raws.raws]
            items.push(response.data)
            dispatch(fetchSuccess(items))
        }catch (e) {
            dispatch(fetchError('Не удалось добавить новое сырьё!'))
        }
    }
}

export function changeRaw(raw: IRaw) {
    return {
        type: RAW_UPDATE_OBJECT,
        item: raw
    }
}

/**
 * Сохранить изменения
 * @param raw Объект сырья
 */
export function updateRaw(raw: IRaw) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(RawEndpoint.saveRaw(raw.id), raw);
            const items = [...getState().raws.raws]
            const index = items.findIndex(value => value.id === raw.id)
            items[index] = raw
            dispatch(fetchSuccess(items))

        }catch (e) {
            dispatch(fetchError(e))
        }
    }
}


export function clearError() {
    return{
        type: RAW_CLEAR_ERROR
    }
}
function fetchStart() {
    return {
        type: RAW_LOAD_START
    }
}

function deleteOk(items: IRaw[]) {
    return{
        type: RAW_DELETE_OK,
        items
    }
}

function fetchFinish() {
    return {
        type: RAW_LOAD_FINISH
    }
}

function fetchError(error: string) {
    return{
        type: RAW_LOAD_ERROR,
        error: error
    }
}

function fetchSuccess(items: IRaw[]) {
    return{
        type: RAW_LOAD_SUCCESS,
        items
    }
}

function rawLoadItemSuccess(item: IRaw) {
    return{
        type: RAW_LOAD_SUCCESS_ITEM,
        item
    }
}
