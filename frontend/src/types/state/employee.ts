import {IEmployee, IEmployeeListItem, IEmployeeWorkTimeItem} from 'types/model/employee'

export interface IEmployeeState {
    items: IEmployeeListItem[];
    employeeItem: IEmployee;
    workTimeItems: IEmployeeWorkTimeItem[];
    isLoading: boolean;
    error: string;
    hasError: boolean
}