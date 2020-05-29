import {IDepartmentState} from "../types/state/department";
import {nullDepartment} from "../types/model/department";
import {
    DEPARTMENT_DELETE_OK,
    DEPARTMENT_LOAD_FINISH, DEPARTMENT_LOAD_ITEM_SUCCESS,
    DEPARTMENT_LOAD_START,
    DEPARTMENT_LOAD_SUCCESS
} from "./actions/types";


const getInitState = () => ({
    items: [],
    departmentItem: nullDepartment,
    isLoading: false,
    error: '',
    hasError: false
});

export const departmentReducer = (state: IDepartmentState = getInitState(), action: any) => {
    switch (action.type) {
        case DEPARTMENT_LOAD_START: return {...state, isLoading: true};
        case DEPARTMENT_LOAD_FINISH: return {...state, isLoading: false};
        case DEPARTMENT_LOAD_SUCCESS: return {...state, items: action.items};
        case DEPARTMENT_DELETE_OK: return {...state, items: action.items};
        case DEPARTMENT_LOAD_ITEM_SUCCESS: return {...state, departmentItem: action.item}
        default: return state;
    }
};