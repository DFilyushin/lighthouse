import {IExpense, IExpenseTableItem} from "../model/expense";

export interface IExpenseState {
    items: IExpenseTableItem[];
    item: IExpense;
    isLoading: boolean;
    hasError: boolean;
    error: string;
    dateStart: string;
    dateEnd: string;
    cost: number;
}
