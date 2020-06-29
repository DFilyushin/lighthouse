import {IRaw} from "./raw";
import {nullProduct, Product} from "./product";

export interface IFormula {
    id: number,
    product: string,
    amount: number
}

export interface IRawInFormula {
    id: number;
    raw: IRaw;
    raw_value: number;
}

export interface IFormulaItem {
    id: number,
    product: Product,
    calcAmount: number,
    calcLosses: number,
    specification: string,
    raws: IRawInFormula []
}

export const nullFormulaItem: IFormulaItem = {
    id: 0,
    product: nullProduct,
    calcAmount: 0,
    calcLosses: 0,
    specification: '',
    raws: []
}