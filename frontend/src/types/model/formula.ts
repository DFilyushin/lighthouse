import {IRaw} from "./raw";
import {nullProduct, IProduct} from "./product";

export interface IFormula {
    id: number;
    product: string;
    amount: number;
    created: string;
}

export interface IFormulaSelectedItem {
    id: number;
    name: string;
}

export interface IRawInFormula {
    id: number;
    raw: IRaw;
    concentration: number;
    substance: number;
    raw_value: number;
}

export interface IFormulaItem {
    id: number;
    product: IProduct;
    calcAmount: number;
    calcLosses: number;
    specification: string;
    density: number;
    raws: IRawInFormula [];
}

export const nullFormulaItem: IFormulaItem = {
    id: 0,
    product: {...nullProduct},
    calcAmount: 0,
    calcLosses: 0,
    specification: '',
    density: 0,
    raws: []
}
