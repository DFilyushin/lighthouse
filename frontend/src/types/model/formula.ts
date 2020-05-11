import {Raw} from "./raw";
import {nullProduct, Product} from "./product";

export interface IFormula {
    id: number,
    product: string,
    amount: number
}

export interface IFormulaItem {
    id: number,
    product: Product,
    amount: number,
    calcLosses: number,
    specification: string,
    raws: Raw []
}

export const nullFormulaItem: IFormulaItem = {
    id: 0,
    product: nullProduct,
    amount: 0,
    calcLosses: 0,
    specification: '',
    raws: []
}