import {IEmployeeListItem, nullEmployeeItem} from "./employee";
import {ITare, nullTare} from "./tare";
import {NO_SELECT_VALUE} from "../../utils/AppConst";
import {IProductionList} from "./production";
import {IContractListItemSimple, nullContractListItemSimple} from "./contract";
import {IProduct} from "./product";

export interface IStoreBase {
    id: number;
    name: string;
    tare: string;
    v: number;
    unit: string;
    total: number;
}

export interface IMaterialItem {
    /**
     * Код материала
     */
    id: number;
    /**
     * Наименование материала
     */
    name: string;
}

export interface IStoreJournal {
    /**
     * Код записи
     */
    id: number;
    /**
     * Тип операции
     */
    type: number;
    /**
     * Дата операции
     */
    date: string;
    /**
     * Наименование материала
     */
    name: string;
    /**
     * Наименование тары
     */
    tare: string;
    /**
     * Количество
     */
    count: number;
    /**
     * Цена
     */
    price: number;
    /**
     * Количество
     */
    total: number;
    /**
     * Ссылка на произв. карту
     */
    factoryId: number;
    /**
     * Ссылка на затраты
     */
    costId: number;
    /**
     * Объём тары
     */
    tareV: number;
}

export interface ICostJournalItem {
    id: number;
    cost: string;
    date: string;
    total: number
}

export interface IStoreJournalItem {
    id: number;
    type: number;
    date: string;
    name: string;
    tare: ITare;
    count: number;
    price: number;
    total: number;
    creator: IEmployeeListItem;
    created: string;
    factoryId: number;
    costId: ICostJournalItem;
    material: IMaterialItem;
    factory: IProductionList;
}

export interface IStoreMaterialItem {
    id: number;
    material: IMaterialItem;
    tare: ITare;
    count: number;
    price: number;
    total: number;
}

export interface IStoreNewMovement {
    date: string;
    employee: IEmployeeListItem;
    comment: string;
    items: IStoreMaterialItem [];
}

export const nullStoreItem: IStoreJournalItem = {
    id: 0,
    type: NO_SELECT_VALUE,
    date: '',
    factoryId: 0,
    costId: {id: 0, cost: '', date: '', total: 0},
    total: 0,
    price: 0,
    count: 0,
    creator: {...nullEmployeeItem},
    created: '',
    name: '',
    tare: {...nullTare},
    material: {id:0, name: ''},
    factory: {id: 0, calcValue: 0, leaderName: '', prodFinish: '', prodStart: '', product: '', state: 0}
}

/**
 * Список резерва продукции
 */
export interface IStoreListReserveProduct {
    id: number;
    start: string;
    end: string;
    material: string;
    employee: string;
    contract: string;
    tare: string;
    tareV: number;
    value: number;
    contractId: number;
}


/**
 * Резерв продукции
 */
export interface IStoreReserveProduct {
    /**
     * Код записи
     */
    id: number;
    /**
     * Материал
     */
    material: IMaterialItem;
    /**
     * Начало резерва
     */
    start: string;
    /**
     * Окончание резерва
     */
    end: string;
    /**э
     * Сотрудник, поставивший в резерв
     */
    employee: IEmployeeListItem;
    /**
     * Резерв принадлежит контракту
     */
    contract: IContractListItemSimple;
    /**
     * Тара
     */
    tare: ITare;
    /**
     * Объём
     */
    value: number;
}

export interface IStoreReturnProduct {
    /**
     * Код записи
     */
    id: number;
    /**
     * Сведения о контракте
     */
    contract: IContractListItemSimple;
    /**
     * Дата возврата продукции
     */
    date: string;
    /**
     * Описание продукции
     */
    product: IProduct;
    /**
     * Тара
     */
    tare: ITare;
    /**
     * Количество тары
     */
    count: number;
    /**
     * Сумма возврата
     */
    total: number;
    /**
     * Причина возврата
     */
    returnCause: string;
    /**
     * Количество в ед. измерения (кг/л.)
     */
    returnValue: number;
}

export const nullStoreReserveProduct: IStoreReserveProduct = {
    id: 0,
    material: {id: 0, name: ''},
    start: '',
    end: '',
    employee: {...nullEmployeeItem},
    contract: {...nullContractListItemSimple},
    tare: {...nullTare},
    value: 0
}

export interface IStoreRaw extends IStoreBase{}

export interface IStoreProduct extends IStoreBase{}

export interface IStoreStock extends  IStoreBase{}
