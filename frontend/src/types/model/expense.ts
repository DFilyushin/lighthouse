import {ICost} from "./cost";
import {IEmployeeListItem, nullEmployeeItem} from "./employee";
import {nullCost} from "../state/cost";

export interface IExpenseTableItem {
    id: number;
    cost: string;
    date: string;
    total: number;
}

export interface IExpense {
    id: number;
    created: string | undefined | null;
    date: string;
    cost: ICost;
    total: number;
    count: number;
    employee: IEmployeeListItem,
    comment: string;
}

export const nullExpenseItem: IExpense = {
    id: 0,
    created: (new Date()).toISOString(),
    date: (new Date()).toISOString().slice(0, 10),
    cost: {...nullCost},
    total: 0,
    count: 0,
    employee: {...nullEmployeeItem},
    comment: ''
}