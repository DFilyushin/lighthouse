import {IEmployee, IEmployeeListItem, nullEmployeeItem} from "./employee";
import {ITare, nullTare} from "./tare";
import {NO_SELECT_VALUE} from "../../utils/AppConst";
import {IProductionMaterial} from "./production";

export interface IStoreBase {
    id: number;
    name: string;
    tare: string;
    v: number;
    unit: string;
    total: number;
}

export interface IMaterialItem {
    id: number;
    name: string;
}

export interface IStoreJournal {
    id: number;
    type: number;
    date: string;
    name: string;
    tare: ITare;
    count: number;
    price: number;
    total: number;
    employee: IEmployeeListItem;
    factoryId: number;
    costId: number;
    material: IMaterialItem;
}

export const nullStoreItem: IStoreJournal = {
    id: 0,
    type: NO_SELECT_VALUE,
    date: '',
    factoryId: 0,
    costId: 0,
    total: 0,
    price: 0,
    count: 0,
    employee: {...nullEmployeeItem},
    name: '',
    tare: {...nullTare},
    material: {id:0, name: ''}
}

export interface IStoreRaw extends IStoreBase{}

export interface IStoreProduct extends IStoreBase{}
