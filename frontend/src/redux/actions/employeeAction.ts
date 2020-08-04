import axios from "axios";
import {hideInfoMessage, showInfoMessage} from "./infoAction";
import EmployeeEndpoint from "services/endpoints/EmployeeEndpoint";
import {IEmployee, IEmployeeListItem, IEmployeeWorkTimeItem} from "types/model/employee";
import {
    EMPLOYEE_CLEAR_ERROR,
    EMPLOYEE_DELETE_OK, EMPLOYEE_ITEM_OK,
    EMPLOYEE_LOAD_FINISH,
    EMPLOYEE_LOAD_START,
    EMPLOYEE_LOAD_SUCCESS,
    EMPLOYEE_LOAD_WORKTIME_SUCCESS,
    EMPLOYEE_SET_ERROR,
    EMPLOYEE_UPDATE_ITEM
} from "./types";

/**
 * Загрузить список сотрудников
 * @param search Строка поиска
 * @param limit Лимит вывода
 */
export function loadEmployeeList(search?: string, limit?: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());

        try {
            const url = EmployeeEndpoint.getEmployeeList(search);
            const items: IEmployeeListItem[] = [];
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push({...response.data[key]})
            });
            dispatch(fetchSuccess(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

export function loadEmployeeWorkTimeTable(id: number, start: string, end: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage());
        try {
            const items: IEmployeeWorkTimeItem[] = [];
            const url = EmployeeEndpoint.getEmployeeWorkTime(id, start, end);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchSuccessLoadWorkTimeTable(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

function fetchSuccessLoadWorkTimeTable(items: IEmployeeWorkTimeItem[]) {
    return{
        type: EMPLOYEE_LOAD_WORKTIME_SUCCESS,
        items
    }
}

/**
 * Загрузить объект сотрудника
 * @param id Код сотрудника
 */
export function loadEmployeeItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        try {
            const url = EmployeeEndpoint.getEmployeeItem(id);
            const response = await axios.get(url);
            const item: IEmployee = response.data;
            dispatch(fetchItemSuccess(item))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить сотрудника
 * @param id Код записи
 */
export function deleteEmployee(id: number){
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(EmployeeEndpoint.deleteEmployee(id));
            if (response.status === 204) {
                const items = [...getState().employee.items];
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
 * Добавить новую запись
 * @param item Объект сотрудника
 */
export function addNewEmployeeItem(item: IEmployee) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            await axios.post(EmployeeEndpoint.newEmployee(), item);
            return Promise.resolve();
        }
        catch (e) {
            dispatch(saveError('Не удалось добавить новую запись!'));
            return Promise.reject();
        }
    }
}

function clearError() {
    return{
        type: EMPLOYEE_CLEAR_ERROR
    }
}

function saveError(error: string) {
    return{
        type: EMPLOYEE_SET_ERROR,
        error: error
    }
}

/**
 * Обновить запись в базе
 * @param item Объект сотрудника
 */
export function updateEmployeeItem(item: IEmployee) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError())
        try{
            await axios.put(EmployeeEndpoint.updateEmployee(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

export function changeEmployeeItem(item: IEmployee) {
    return{
        type: EMPLOYEE_UPDATE_ITEM,
        item: item
    }
}

function fetchItemSuccess(item: IEmployee) {
    return{
        type: EMPLOYEE_ITEM_OK,
        item: item
    }
}


function deleteOk(items: IEmployeeListItem[]) {
    return{
        type: EMPLOYEE_DELETE_OK,
        items: items
    }
}

function fetchStart() {
    return{
        type: EMPLOYEE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: EMPLOYEE_LOAD_FINISH
    }
}

function fetchSuccess(items: IEmployeeListItem[]) {
    return{
        type: EMPLOYEE_LOAD_SUCCESS,
        items: items
    }
}