import {IRaw} from "./raw";
import {nullProduct, IProduct} from "./product";
import {IUnit} from "./unit";

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
    unit: IUnit;
    concentration: number;
    substance: number;
    raw_value: number;
}

export interface IFormulaItem {
    id: number;
    created: string;
    product: IProduct;
    calcAmount: number;
    calcLosses: number;
    specification: string;
    density: number;
    raws: IRawInFormula [];
}

export const nullFormulaItem: IFormulaItem = {
    id: 0,
    created: '',
    product: {...nullProduct},
    calcAmount: 0,
    calcLosses: 0,
    specification: '',
    density: 1,
    raws: []
}
