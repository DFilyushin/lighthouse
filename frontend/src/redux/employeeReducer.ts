import {IEmployeeState} from "../types/state/employee";
import {nullEmployee} from "../types/model/employee";
import {
    EMPLOYEE_LOAD_START,
    EMPLOYEE_LOAD_FINISH,
    EMPLOYEE_LOAD_SUCCESS,
    EMPLOYEE_SET_ERROR,
    EMPLOYEE_DELETE_OK,
    EMPLOYEE_ITEM_OK,
    EMPLOYEE_UPDATE_ITEM,
    EMPLOYEE_CLEAR_ERROR
} from "./actions/types";

const getInitState = () => ({
    items: [],
    employeeItem: nullEmployee,
    isLoading: false,
    error: '',
    hasError: false
});

export const employeeReducer = (state: IEmployeeState = getInitState(), action: any)=>{
    switch (action.type) {
        case EMPLOYEE_LOAD_START: return {...state, isLoading: true};
        case EMPLOYEE_LOAD_FINISH: return {...state, isLoading: false};
        case EMPLOYEE_LOAD_SUCCESS: return {...state, items: action.items};
        case EMPLOYEE_SET_ERROR: return {...state, error: action.error, hasError: true};
        case EMPLOYEE_DELETE_OK: return {...state, items: action.items};
        case EMPLOYEE_ITEM_OK: return {...state, employeeItem: action.item};
        case EMPLOYEE_UPDATE_ITEM: return {...state, employeeItem: action.item};
        case EMPLOYEE_CLEAR_ERROR: return {...state, error: '', hasError: false};
        default: return state;
    };
};