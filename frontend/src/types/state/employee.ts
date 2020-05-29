import {IEmployee, IEmployeeListItem} from 'types/model/employee'

export interface IEmployeeState {
    items: IEmployeeListItem[];
    employeeItem: IEmployee;
    isLoading: boolean;
    error: string;
    hasError: boolean
}