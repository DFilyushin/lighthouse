import {IDepartment} from "../model/department";

export interface IDepartmentState {
    items: IDepartment[];
    departmentItem: IDepartment;
    isLoading: boolean;
    error: string;
    hasError: boolean
}