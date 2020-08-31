import {hideInfoMessage, showInfoMessage} from "./infoAction";
import {
    EXPENSE_DELETE_OK,
    EXPENSE_LOAD_FINISH,
    EXPENSE_LOAD_START,
    EXPENSE_LOAD_SUCCESS,
    EXPENSE_SET_COST_VALUE,
    EXPENSE_SET_END_DATE,
    EXPENSE_SET_START_DATE,
    EXPENSE_LOAD_SUCCESS_ITEM, EXPENSE_CHANGE_ITEM
} from "./types";
import {IExpense, IExpenseTableItem, nullExpenseItem} from "../../types/model/expense";
import ExpenseEndpoint from "../../services/endpoints/ExpenseEndpoint";
import authAxios from "../../services/axios-api";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";
import AuthenticationService from "../../services/Authentication.service";
import {EXPENSE_PERIOD_END, EXPENSE_PERIOD_START} from "../../types/Settings";


/**
 * Загрузить список затрат
 */
export function loadExpenseList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        const dateStart = getState().expense.dateStart;
        const dateEnd = getState().expense.dateEnd;
        const costId = getState().expense.cost;
        try {
            const url = ExpenseEndpoint.getExpenseList(dateStart, dateEnd, costId);
            const items: IExpenseTableItem[] = [];
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
 * Загрузить объект затрат
 * @param id Код записи
 */
export function loadExpenseItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        dispatch(hideInfoMessage())
        if (id === NEW_RECORD_VALUE) {
            const idEmployee = AuthenticationService.currentEmployeeId()
            const fio = AuthenticationService.currentEmployee()
            const item = {
                ...nullExpenseItem, employee: {
                    id: idEmployee,
                    tabNum: '',
                    fio: fio,
                    staff: '',
                    fired: ''
                }
            }
            dispatch(fetchSuccessItem(item))
        } else {
            try {
                const url = ExpenseEndpoint.getExpense(id)
                const response = await authAxios.get(url)
                const item: IExpense = response.data

                dispatch(fetchSuccessItem(item))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
            dispatch(fetchFinish())
        }
    }
}

/**
 * ОБновление затраты
 * @param item Объект затраты
 */
export function updateExpenseItem(item: IExpense) {
    return async (dispatch: any, getState: any) => {
        try {
            delete item.created
            await authAxios.put(ExpenseEndpoint.updateExpense(item.id), item);
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Новая затрата
 * @param item Объект затраты
 */
export function addExpenseItem(item: IExpense) {
    return async (dispatch: any, getState: any) => {
        try {
            delete item.created
            await authAxios.post(ExpenseEndpoint.newExpense(), item)
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Удаление затраты
 * @param id Код записи
 */
export function deleteExpense(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        try {
            const response = await authAxios.delete(ExpenseEndpoint.deleteExpense(id))
            if (response.status === 204) {
                const items = [...getState().employee.items]
                const index = items.findIndex((elem) => {
                    return elem.id === id
                })
                items.splice(index, 1)
                dispatch(deleteOk(items))
                dispatch(showInfoMessage('info', 'Запись успешно удалена'))
            } else {
                dispatch(showInfoMessage('error', `Неизвестная ошибка при удалении: ${response.status.toString()}`))
            }
        } catch (e) {
            dispatch(showInfoMessage('error', `Не удалось удалить запись ${e.toString()}!`))
        }
        dispatch(fetchFinish())
    }
}

export function changeExpense(item: IExpense) {
    return {
        type: EXPENSE_CHANGE_ITEM,
        item
    }
}

export function setExpenseCost(newValue: number) {
    return {
        type: EXPENSE_SET_COST_VALUE,
        value: newValue
    }
}

/**
 * Установить начальную дату просмотра
 * @param newDate Новое значение даты
 */
export function setExpenseDateStart(newDate: string) {
    localStorage.setItem(EXPENSE_PERIOD_START, newDate)
    return {
        type: EXPENSE_SET_START_DATE,
        date: newDate
    }
}

/**
 * Установить конечную дату просмотра
 * @param newDate Новое значение даты
 */
export function setExpenseDateEnd(newDate: string) {
    localStorage.setItem(EXPENSE_PERIOD_END, newDate)
    return {
        type: EXPENSE_SET_END_DATE,
        date: newDate
    }
}


function fetchStart() {
    return {
        type: EXPENSE_LOAD_START
    }
}

function fetchFinish() {
    return {
        type: EXPENSE_LOAD_FINISH
    }
}

function fetchSuccess(items: IExpenseTableItem[]) {
    return {
        type: EXPENSE_LOAD_SUCCESS,
        items
    }
}

function fetchSuccessItem(item: IExpense) {
    return {
        type: EXPENSE_LOAD_SUCCESS_ITEM,
        item
    }
}

function deleteOk(items: IExpenseTableItem[]) {
    return {
        type: EXPENSE_DELETE_OK,
        items
    }
}
