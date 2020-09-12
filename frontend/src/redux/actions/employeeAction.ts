import {hideInfoMessage, showInfoMessage} from "./infoAction"
import EmployeeEndpoint from "services/endpoints/EmployeeEndpoint"
import {IEmployee, IEmployeeListItem, IEmployeeProduct, IEmployeeWorkTimeItem, nullEmployee} from "types/model/employee"
import {
    EMPLOYEE_CLEAR_ERROR,
    EMPLOYEE_DELETE_OK, EMPLOYEE_ITEM_OK,
    EMPLOYEE_LOAD_FINISH,
    EMPLOYEE_LOAD_START,
    EMPLOYEE_LOAD_SUCCESS,
    EMPLOYEE_LOAD_WITHOUT_LOGINS,
    EMPLOYEE_LOAD_WORKTIME_SUCCESS,
    EMPLOYEE_SET_ERROR,
    EMPLOYEE_UPDATE_ITEM,
    EMPLOYEE_CHANGE_FIRED, EMPLOYEE_SET_NOT_FOUND
} from "./types"
import authAxios from "../../services/axios-api"
import {NEW_RECORD_VALUE} from "../../utils/AppConst"
import {IProduct} from "../../types/model/product";
import {getRandomInt, MAX_RANDOM_VALUE} from "../../utils/AppUtils";


/**
 * Загрузить список сотрудников
 * @param showFired
 * @param search Строка поиска
 * @param limit Лимит вывода
 */
export function loadEmployeeList(showFired: boolean = false, search?: string, limit?: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());

        try {
            const url = EmployeeEndpoint.getEmployeeList(showFired, search);
            const items: IEmployeeListItem[] = [];
            const response = await authAxios.get(url);
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


/**
 * Загрузить отработанное время сотрудником
 * @param id Код сотрудника
 * @param start Начало периода
 * @param end Окончание периода
 */
export function loadEmployeeWorkTimeTable(id: number, start: string, end: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage());
        try {
            const items: IEmployeeWorkTimeItem[] = [];
            const url = EmployeeEndpoint.getEmployeeWorkTime(id, start, end);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            });
            dispatch(fetchSuccessLoadWorkTimeTable(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Загрузить список сотрудников без учётных данных
 */
export function loadEmployeeWithoutLogins() {
    return async (dispatch: any, getState: any) => {
        try{
            const items: IEmployeeListItem[] = []
            const response = await authAxios.get(EmployeeEndpoint.getEmployeeWithoutUsername())
            Object.keys(response.data).forEach((key, index) => {
                items.push(response.data[key])
            })
            dispatch(fetchLoadEmployeeWithoutLogins(items))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

function fetchLoadEmployeeWithoutLogins(items: IEmployeeListItem[]) {
    return{
        type: EMPLOYEE_LOAD_WITHOUT_LOGINS,
        items
    }
}

function fetchSuccessLoadWorkTimeTable(items: IEmployeeWorkTimeItem[]) {
    return{
        type: EMPLOYEE_LOAD_WORKTIME_SUCCESS,
        items
    }
}


export function changeFiredStatus(value: boolean) {
    return{
        type: EMPLOYEE_CHANGE_FIRED,
        value
    }
}

/**
 * Загрузить объект сотрудника
 * @param id Код сотрудника
 */
export function loadEmployeeItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        dispatch(hideInfoMessage());
        dispatch(setNotFoundValue(false))
        if (id === NEW_RECORD_VALUE) {
            const item: IEmployee = {...nullEmployee}
            dispatch(fetchItemSuccess(item))
        }else {
            try {
                const url = EmployeeEndpoint.getEmployeeItem(id)
                const response = await authAxios.get(url)
                const item: IEmployee = response.data
                dispatch(fetchItemSuccess(item))
            } catch (e) {
                if (e.response.status === 404){
                    dispatch(setNotFoundValue(true))
                }
                dispatch(showInfoMessage('error', e.toString()))
            }
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
            const response = await authAxios.delete(EmployeeEndpoint.deleteEmployee(id));
            if (response.status === 204) {
                const items = [...getState().employee.items];
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
 * Добавить новую запись
 * @param item Объект сотрудника
 */
export function addNewEmployeeItem(item: IEmployee) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            delete item.created
            await authAxios.post(EmployeeEndpoint.newEmployee(), item);
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
            await authAxios.put(EmployeeEndpoint.updateEmployee(item.id), item);
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}


/**
 * Удалить запись с продукцией
 * @param id Код записи
 */
export function deleteEmployeeProduct(id: number) {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().employee.employeeItem};
        const index = item.empllink.findIndex((item:IEmployeeProduct)=> {return item.id === id});
        item.empllink.splice(index, 1);
        dispatch(fetchItemSuccess(item));
    }
}

/**
 * Добавить новую позицию в список продукции, доступной сотруднику
 * @param product Объект продукта
 */
export function addEmployeeProduct(product: IProduct) {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().employee.employeeItem}
        const newProduct: IEmployeeProduct = {
            id: -getRandomInt(MAX_RANDOM_VALUE),
            productId: product.id,
            productName: product.name
        }
        item.empllink.push(
            newProduct
        )
        dispatch(fetchItemSuccess(item))
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

function setNotFoundValue(value: boolean) {
    return{
        type: EMPLOYEE_SET_NOT_FOUND,
        value
    }
}
