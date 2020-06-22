import {hideInfoMessage, showInfoMessage} from "./infoAction";
import FactoryLineEndpoint from "../../services/endpoints/FactoryLineEndpoint";
import {IFactoryLine} from "../../types/model/factorylines";
import axios from "axios";
import {
    EXPENSE_DELETE_OK,
    EXPENSE_LOAD_FINISH,
    EXPENSE_LOAD_START,
    EXPENSE_LOAD_SUCCESS, EXPENSE_SET_COST_VALUE,
    EXPENSE_SET_END_DATE,
    EXPENSE_SET_START_DATE
} from "./types";
import {IExpenseTableItem} from "../../types/model/expense";
import ExpenseEndpoint from "../../services/endpoints/ExpenseEndpoint";


export function loadExpenseList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage());
        console.log('test state', getState().expense)
        const dateStart = getState().expense.dateStart;
        const dateEnd = getState().expense.dateEnd;
        const costId = getState().expense.cost;
        try {
            const url = ExpenseEndpoint.getExpenseList(dateStart, dateEnd, costId);
            console.log(url);
            const items: IExpenseTableItem[] = [];
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                items.push({
                    id: response.data[key]['id'],
                    cost: response.data[key]['cost'],
                    date: response.data[key]['date'],
                    total: response.data[key]['total']
                })
            });
            dispatch(fetchSuccess(items))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

export function deleteExpense(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(ExpenseEndpoint.deleteExpense(id));
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

export function setExpenseCost(newValue: number) {
    return{
        type: EXPENSE_SET_COST_VALUE,
        value: newValue
    }
}

export function setExpenseDateStart(newDate: string) {
    return{
        type: EXPENSE_SET_START_DATE,
        date: newDate
    }
}

export function setExpenseDateEnd(newDate: string) {
    return{
        type: EXPENSE_SET_END_DATE,
        date: newDate
    }
}


function fetchStart() {
    return{
        type: EXPENSE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: EXPENSE_LOAD_FINISH
    }
}

function fetchSuccess(items: IExpenseTableItem[]) {
    return{
        type: EXPENSE_LOAD_SUCCESS,
        items
    }
}

function deleteOk(items: IExpenseTableItem[]) {
    return{
        type: EXPENSE_DELETE_OK,
        items
    }
}
