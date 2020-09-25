/**
 * Список производственных карт
 */
import {nullProduct, IProduct} from "./product";
import {IFactoryLine} from "./factorylines";
import {IRaw} from "./raw";
import {IFormulaItem, nullFormulaItem} from "./formula";
import {IWork, nullWork} from "./work";
import {IUnit} from "./unit";

export const CARD_STATE_DRAFT = 0;
export const CARD_STATE_IN_WORK = 1;
export const CARD_STATE_READY = 2;
export const CARD_STATE_ERROR = 3;
export const CARD_STATE_CANCEL = 4;

export const CARD_STATE_ITEMS = [
    {id: CARD_STATE_DRAFT, name: 'Черновик'},
    {id: CARD_STATE_IN_WORK, name: 'В работе'},
    {id: CARD_STATE_READY, name: 'Выполненные'},
    {id: CARD_STATE_ERROR, name: 'С ошибкой'},
    {id: CARD_STATE_CANCEL, name: 'Отменённый'}
]

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
    product: IProduct;
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
    formula: IFormulaItem;
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
    creator: {...nullEmployee},
    product: {...nullProduct},
    prodLine: {id: 0, name: ''},
    prodStart: new Date().toISOString(),
    prodFinish: new Date().toISOString(),
    calcValue: 0,
    outValue: 0,
    lossValue: 0,
    comment: '',
    teamLeader: {...nullEmployee},
    curState: 0,
    idFormula: 0,
    formula: {...nullFormulaItem}
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
    work: IWork;
}

export const nullProductionTeam: IProductionTeam = {
    id: 0,
    manufactureId: 0,
    employee: {id: 0, tabNum: '', fio: '', staff: ''},
    periodStart: (new Date()).toISOString(),
    periodEnd: (new Date()).toISOString(),
    work: {...nullWork}
};

export const nullProductionMaterial: IProductionMaterial = {
    id: 0,
    materialId: 0,
    materialName: '',
    total: 0
}

/**
 * Калькуляция
 */
export interface IProductionCalc {
    /**
     * Код записи
     */
    id: number;
    /**
     * Код производственной карты
     */
    manufactureId: number;
    /**
     * Единица измерения
     */
    unit: IUnit;
    /**
     * Сырьё
     */
    raw: IRaw;
    /**
     * Количество
     */
    calcValue: number;
}

export const nullProductionCalc: IProductionCalc = {
    id: 0,
    manufactureId: 0,
    unit: {id: 0, name: ''},
    raw: {id: 0, name: ''},
    calcValue: 0
}


/**
 * Готовая продукция в таре
 */
export interface IProductionTare {
    id: number;
    tareId: number;
    tareName: string;
    tareV: number;
    count: number;
}

export interface IProductionMaterial {
    id: number;
    materialId: number;
    materialName: string;
    total: number;
}

export const nullProductionTare: IProductionTare = {
    id: 0,
    tareId: 0,
    tareName: '',
    tareV: 0,
    count: 0
};

export const CardStateString  = [
    "Черновик",
    "В работе",
    "Выполнен",
    "Завершён с ошибкой",
    "Отменён"
];
