import axios from "axios";
import {hideInfoMessage, showInfoMessage} from "./infoAction";
import DepartmentEndpoint from "services/endpoints/DepartmentEndpoint";
import {IDepartment} from "types/model/department";
import {
    DEPARTMENT_CLEAR_ERROR,
    DEPARTMENT_DELETE_OK,
    DEPARTMENT_LOAD_FINISH, DEPARTMENT_LOAD_ITEM_SUCCESS,
    DEPARTMENT_LOAD_START,
    DEPARTMENT_LOAD_SUCCESS, DEPARTMENT_SET_ERROR
} from "./types";
import {Staff} from "../../types/model/staff";


/**
 * Список подразделений
 * @param search строка поиска
 * @param limit Лимит вывода записей
 * @param offset Сдвиг
 */
export function loadDepartments(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());

        try {
            const url = DepartmentEndpoint.getDepartmentList(search, limit, offset);
            const items: IDepartment[] = [];
            const response = await axios.get(url);
            console.log(response.data)
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
 * Загрузить объект подразделения
 * @param id Код подразделения
 */
export function loadDepartmentItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let item: Staff = {id: 0, name: ""};
        dispatch(fetchStart());
        if (id===0) {
            dispatch(loadItemSuccess(item))
        }else {
            try {
                const response = await axios.get(DepartmentEndpoint.getDepartment(id));
                item.id = response.data['id'];
                item.name = response.data['name'];
                dispatch(loadItemSuccess(item))
            } catch (e) {
                dispatch(fetchError(e))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удаление структурного подразделения
 * @param id Код записи
 */
export function deleteDepartment(id: number){
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(DepartmentEndpoint.deleteDepartment(id));
            if (response.status === 204) {
                const items = [...getState().department.items];
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
 * Добавление нового подразделения
 * @param item ОБъект записи
 */
export function addNewDepartment(item: IDepartment) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const response = await axios.post(DepartmentEndpoint.newDepartment(), item);
            if (response.status === 201){
                const items = [...getState().department.items];
                items.push(item);
                dispatch(loadItemSuccess(item));
                dispatch(fetchSuccess(items));
            }

        }catch (e) {
            dispatch(fetchError('Не удалось добавить новую запись!'))
        }
    }
}

/**
 * Обновление записи
 * @param item - Объект записи
 */
export function updateDepartmentItem(item: IDepartment) {
    return async (dispatch: any, getState: any) => {
        try{
            await axios.put(DepartmentEndpoint.updateDepartment(item.id), item);
        }catch (e) {
            dispatch(fetchError(e))
        }
    }
}

export function changeDepartmentItem(item: IDepartment) {
    return{
        type: DEPARTMENT_LOAD_ITEM_SUCCESS,
        item
    }
}

function loadItemSuccess(item: IDepartment) {
    return{
        type: DEPARTMENT_LOAD_ITEM_SUCCESS,
        item
    }
}

function clearError() {
    return{
        type: DEPARTMENT_CLEAR_ERROR
    }
}

function fetchError(error: string) {
    return{
        type: DEPARTMENT_SET_ERROR,
        error
    }
}

function fetchStart() {
    return {
        type: DEPARTMENT_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: DEPARTMENT_LOAD_FINISH
    }
}

function fetchSuccess(items: IDepartment[]) {
    return{
        type: DEPARTMENT_LOAD_SUCCESS,
        items: items
    }
}

function deleteOk(items: IDepartment[]) {
    return{
        type: DEPARTMENT_DELETE_OK,
        items
    }
}