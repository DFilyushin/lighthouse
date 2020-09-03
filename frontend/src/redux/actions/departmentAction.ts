import {hideInfoMessage, showInfoMessage} from "./infoAction"
import DepartmentEndpoint from "services/endpoints/DepartmentEndpoint"
import {IDepartment, nullDepartment} from "types/model/department"
import {
    DEPARTMENT_CLEAR_ERROR,
    DEPARTMENT_DELETE_OK,
    DEPARTMENT_LOAD_FINISH,
    DEPARTMENT_LOAD_ITEM_SUCCESS,
    DEPARTMENT_LOAD_START,
    DEPARTMENT_LOAD_SUCCESS,
    DEPARTMENT_SET_ERROR
} from "./types"
import authAxios from "../../services/axios-api"
import {NEW_RECORD_VALUE} from "../../utils/AppConst";


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
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            })
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
        let item: IDepartment = {...nullDepartment};
        dispatch(fetchStart());
        if (id === NEW_RECORD_VALUE) {
            dispatch(loadItemSuccess(item))
        }else {
            try {
                const response = await authAxios.get(DepartmentEndpoint.getDepartment(id));
                item = response.data
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
            const response = await authAxios.delete(DepartmentEndpoint.deleteDepartment(id));
            if (response.status === 204) {
                const items = [...getState().department.items];
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
 * Добавление нового подразделения
 * @param item ОБъект записи
 */
export function addNewDepartment(item: IDepartment) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const response = await authAxios.post(DepartmentEndpoint.newDepartment(), item);
            if (response.status === 201){
                const items = [...getState().department.items];
                const newItem = response.data
                items.push(newItem)
                items.sort(function (a, b) {
                    const nameA=a.name.toLowerCase()
                    const nameB=b.name.toLowerCase()
                    if (nameA < nameB) //сортируем строки по возрастанию
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0 // Никакой сортировки
                })
                dispatch(fetchSuccess(items));
            }
        }catch (e) {
            console.log('Error save new record department. Error message:', e.response)
            const  errorMessage = `Не удалось добавить новую запись по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
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
            await authAxios.put(DepartmentEndpoint.updateDepartment(item.id), item);
        }catch (e) {
            console.log('Error save departments record. Error message:', e.response)
            const  errorMessage = `Не удалось обновить данные по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
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
