import {ICost} from "./cost";
import {IEmployeeListItem} from "./employee";

export interface IExpenseTableItem {
    id: number;
    cost: string;
    date: string;
    total: number;
}

export interface IExpense {
    id: number;
    created: string;
    date: string;
    cost: ICost;
    total: number;
    count: number;
    employee: IEmployeeListItem,
    comment: string;
}
