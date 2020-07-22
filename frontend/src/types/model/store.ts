import {IEmployeeListItem, nullEmployeeItem} from "./employee";
import {ITare, nullTare} from "./tare";
import {NO_SELECT_VALUE} from "../../utils/AppConst";
import {IProductionList} from "./production";

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

export interface IStoreRaw extends IStoreBase{}

export interface IStoreProduct extends IStoreBase{}
