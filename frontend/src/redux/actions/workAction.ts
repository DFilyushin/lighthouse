import {hideInfoMessage, showInfoMessage} from "./infoAction";
import {WORK_LOAD_FINISH, WORK_LOAD_START, WORK_LOAD_SUCCESS, WORK_DELETE_OK, WORK_LOAD_ITEM_SUCCESS} from "./types";
import {IWork} from "types/model/work";
import {WorkEndpoint} from "services/endpoints/WorkEndpoint";
import {NEW_RECORD_VALUE} from "utils/AppConst";
import {clearError} from "./rawAction";
import authAxios from "../../services/axios-api";


/**
 * Загрузить список
 * @param search Строка поиска
 */
export function loadWorkList(search?: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        try {
            const url = WorkEndpoint.getWorkList(search);
            const unitList: IWork[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                unitList.push(response.data[key])
            });
            dispatch(fetchSuccess(unitList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

export function changeWork(item: IWork) {
    return {
        type: WORK_LOAD_ITEM_SUCCESS,
        item
    }
}

/**
 * Удалить запись по коду
 * @param id Код записи
 */
export function deleteWork(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await authAxios.delete(WorkEndpoint.deleteWorkItem(id));
            if (response.status === 204) {
                const items = [...getState().works.workItems];
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
 * Загрузить имеющуюся запись по коду
 * @param id Код записи
 */
export function loadWorkItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let item: IWork = {id: 0, name: ''};
        if (id === NEW_RECORD_VALUE) {
            dispatch(getItemSuccess(item))
        }else{
            dispatch(fetchStart());
            try{
                const response = await authAxios.get(WorkEndpoint.getWorkItem(id));
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
 * Добавить новую запись
 * @param item
 */
export function addNewWorks(item: IWork) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const response = await authAxios.post(WorkEndpoint.newWorkItem(), item);
            const items = [...getState().works.workItems]
            items.push(response.data)
            dispatch(fetchSuccess(items))
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось добавить новую запись!'))
            throw e
        }
    }
}

/**
 * Обновление записи
 * @param item Объект записи
 */
export function updateWorks(item: IWork) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(WorkEndpoint.updateWorkItem(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', 'Не удалось обновить запись!'))
            throw e
        }
    }
}

function getItemSuccess(item: IWork) {
    return{
        type: WORK_LOAD_ITEM_SUCCESS,
        item
    }
}

function deleteOk(items: IWork[]) {
    return {
        type: WORK_DELETE_OK,
        items
    }
}

function fetchStart() {
    return {
        type: WORK_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: WORK_LOAD_FINISH
    }
}

function fetchSuccess(items: IWork[]) {
    return{
        type: WORK_LOAD_SUCCESS,
        items
    }
}
