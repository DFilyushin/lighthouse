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
    EMPLOYEE_CLEAR_ERROR,
    EMPLOYEE_LOAD_WORKTIME_SUCCESS,
    EMPLOYEE_LOAD_WITHOUT_LOGINS,
    EMPLOYEE_CHANGE_FIRED, EMPLOYEE_SET_NOT_FOUND
} from "./actions/types";

const getInitState = () => ({
    employeeItems: [],
    employeeItem: nullEmployee,
    isLoading: false,
    error: '',
    hasError: false,
    workTimeItems: [],
    employeeWithoutLogins: [],
    showFired: false,
    notFound: false
});

export const employeeReducer = (state: IEmployeeState = getInitState(), action: any) => {
    switch (action.type) {
        case EMPLOYEE_LOAD_START:
            return {...state, isLoading: true};
        case EMPLOYEE_LOAD_FINISH:
            return {...state, isLoading: false};
        case EMPLOYEE_LOAD_SUCCESS:
            return {...state, employeeItems: action.items};
        case EMPLOYEE_SET_ERROR:
            return {...state, error: action.error, hasError: true};
        case EMPLOYEE_DELETE_OK:
            return {...state, employeeItems: action.items};
        case EMPLOYEE_ITEM_OK:
            return {...state, employeeItem: action.item};
        case EMPLOYEE_UPDATE_ITEM:
            return {...state, employeeItem: action.item};
        case EMPLOYEE_CLEAR_ERROR:
            return {...state, error: '', hasError: false};
        case EMPLOYEE_LOAD_WORKTIME_SUCCESS:
            return {...state, workTimeItems: action.items}
        case EMPLOYEE_LOAD_WITHOUT_LOGINS:
            return {...state, employeeWithoutLogins: action.items}
        case EMPLOYEE_CHANGE_FIRED:
            return {...state, showFired: action.value}
        case EMPLOYEE_SET_NOT_FOUND:
            return {...state, notFound: action.value}
        default:
            return state;
    }
}
