import {IExpenseState} from "../types/state/expense";
import {nullEmployeeItem} from "../types/model/employee";
import {
    EXPENSE_CHANGE_ITEM,
    EXPENSE_DELETE_OK,
    EXPENSE_LOAD_FINISH,
    EXPENSE_LOAD_START,
    EXPENSE_LOAD_SUCCESS,
    EXPENSE_LOAD_SUCCESS_ITEM,
    EXPENSE_SET_COST_VALUE,
    EXPENSE_SET_END_DATE,
    EXPENSE_SET_START_DATE
} from "./actions/types";
import {
	EXPENSE_PERIOD_END,
	EXPENSE_PERIOD_START
} from "../types/Settings";
import {getStartCurrentMonthDate} from "../utils/AppUtils";


const getInitialState = () => ({
    items: [],
    item: {
        id: 0,
        cost: {
            id: 0,
            name: "",
            childs: [],
            parent: 0
        },
        comment: "",
        count: 0,
        created: "",
        date: "",
        employee: nullEmployeeItem,
        total: 0
    },
    dateStart: localStorage.getItem(EXPENSE_PERIOD_START) ||  (getStartCurrentMonthDate()).toISOString().slice(0, 10),
    dateEnd: localStorage.getItem(EXPENSE_PERIOD_END) || (new Date()).toISOString().slice(0, 10),
    cost: 0,
    error: "",
    hasError: false,
    isLoading: false
})

export const expenseReducer = (state: IExpenseState = getInitialState(), action: any) => {
    switch (action.type) {
        case EXPENSE_LOAD_START:
            return {...state, isLoading: true}
        case EXPENSE_LOAD_FINISH:
            return {...state, isLoading: false}
        case EXPENSE_LOAD_SUCCESS:
            return {...state, items: action.items}
        case EXPENSE_SET_START_DATE:
            return {...state, dateStart: action.date}
        case EXPENSE_SET_END_DATE:
            return {...state, dateEnd: action.date}
        case EXPENSE_DELETE_OK:
            return {...state, items: action.items}
        case EXPENSE_SET_COST_VALUE:
            return {...state, cost: action.value}
        case EXPENSE_LOAD_SUCCESS_ITEM:
            return {...state, item: action.item}
        case EXPENSE_CHANGE_ITEM:
            return {...state, item: action.item}
        default:
            return state;
    }
}
