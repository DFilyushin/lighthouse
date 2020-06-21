import {hideInfoMessage, showInfoMessage} from "./infoAction";
import FactoryLineEndpoint from "../../services/endpoints/FactoryLineEndpoint";
import {IFactoryLine} from "../../types/model/factorylines";
import axios from "axios";
import {
    EXPENSE_LOAD_FINISH,
    EXPENSE_LOAD_START,
    EXPENSE_LOAD_SUCCESS,
    EXPENSE_SET_END_DATE,
    EXPENSE_SET_START_DATE
} from "./types";
import {IExpenseTableItem} from "../../types/model/expense";
import ExpenseEndpoint from "../../services/endpoints/ExpenseEndpoint";


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

export function setExpenseDateStart(newDate: string) {
    console.log('setExpenseDateStart', newDate)
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
