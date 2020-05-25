/**
 * Список производственных карт
 */
import {nullProduct, Product} from "./product";
import {IFactoryLine} from "./factorylines";
import {Raw} from "./raw";

export interface IProductionList {
    id: number;
    prodStart: string;
    prodFinish: string;
    product: string;
    calcValue: number;
    leaderName: string;
    state: number;
}

export interface ITempEmployee {
    id: number;
    tabNum: string;
    fio: string;
    staff: string;
}

/**
 * Производственная карта
 */
export interface IProduction {
    id: number;
    created: string;
    creator: ITempEmployee;
    product: Product;
    prodLine: IFactoryLine;
    prodStart: string;
    prodFinish: string;
    calcValue: number;
    outValue: number;
    lossValue: number;
    comment: string;
    teamLeader: ITempEmployee;
    curState: number;
    idFormula: number;
}

export const nullEmployee: ITempEmployee = {
    id: 0,
    tabNum: '',
    fio: '',
    staff: ''
};

export const nullProduction: IProduction = {
    id: 0,
    created: '',
    creator: nullEmployee,
    product: nullProduct,
    prodLine: {id: 0, name: ''},
    prodStart: '',
    prodFinish: '',
    calcValue: 0,
    outValue: 0,
    lossValue: 0,
    comment: '',
    teamLeader: nullEmployee,
    curState: 0,
    idFormula: 0
};

/**
 * Смена сотрудника в процессе производства
 */
export interface IProductionTeam {
    id: number;
    manufactureId: number;
    employee: ITempEmployee;
    periodStart: string;
    periodEnd: string;
}

export const nullProductionTeam: IProductionTeam = {
    id: 0,
    manufactureId: 0,
    employee: {id: 0, tabNum: '', fio: '', staff: ''},
    periodStart: '',
    periodEnd: ''
};

/**
 * Калькуляция
 */
export interface IProductionCalc {
    id: number;
    manufactureId: number;
    raw: Raw;
    calcValue: number;
}

export const nullProductionCalc: IProductionCalc = {
    id: 0,
    manufactureId: 0,
    raw: {id: 0, name: ''},
    calcValue: 0
}