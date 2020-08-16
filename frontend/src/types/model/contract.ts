import {IClientItem, nullClientItem} from "./client";
import {IProduct, nullProduct} from "./product";
import {ITare, nullTare} from "./tare";
import {IEmployeeListItem, nullEmployeeItem} from "./employee";
import {getRandomInt, MAX_RANDOM_VALUE} from "../../utils/AppUtils";

/**
 * Статусы контрактов
 */
export const CONTRACT_UNDEFINED_STATE = -1
export const CONTRACT_STATE_DRAFT = 1
export const CONTRACT_STATE_ACTIVE = 2
export const CONTRACT_STATE_READY = 3


export interface IContractListItemSimple {
    id: number;
    num: string;
    date: string;
    client: string;
}

export const nullContractListItemSimple: IContractListItemSimple = {
    id: 0,
    num: '',
    date: '',
    client: ''
}

export interface IContractListItem {
    id: number;
    num: string;
    clientName: string;
    contractDate: string;
    estDelivery: string;
    status: number;
    sum: number;
}

export interface IPaymentContractItem {
    id: number;
    created: string;
    date: string;
    num: string;
    type: string;
    value: number;
}

export interface IWaitPaymentContractItem {
    id: number;
    created: string;
    waitDate: string;
    waitSum: number;
}

export const nullWaitPaymentContractItem: IWaitPaymentContractItem = {
    id: -getRandomInt(MAX_RANDOM_VALUE),
    created: '',
    waitDate: '',
    waitSum: 0
}

export const nullContractItem: IContract = {
    id: 0,
    num: '',
    client: {...nullClientItem},
    contractDate: '',
    delivered: '',
    contractState: 0,
    comment: '',
    created: '',
    discount: 0,
    contractId: '',
    estDelivery: '',
    agent: nullEmployeeItem,
    deliveryTerms: '',
    specs: [],
    payments: [],
    waitPayments: []
};

export const nullContractSpecItem : IContractSpecItem = {
    id: 0,
    product: {...nullProduct},
    tare: nullTare,
    itemCount: 0,
    itemPrice: 0,
    itemTotal: 0,
    itemDiscount: 0,
    delivered: '',
    delivery: ''
}

export interface IContractSpecItem {
    id: number;
    product: IProduct;
    tare: ITare;
    itemCount: number;
    itemPrice: number;
    itemNds: number;
    itemTotal: number;
    itemDiscount: number;
    delivery: string;
    delivered: string;
}

export interface IContract {
    id: number;
    created: string;
    client: IClientItem;
    num: string;
    contractDate: string;
    contractState: number;
    estDelivery: string;
    delivered: string | null;
    discount: number;
    comment: string;
    contractId: string;
    agent: IEmployeeListItem;
    deliveryTerms: string;
    specs: IContractSpecItem[];
    payments: IPaymentContractItem[];
    waitPayments: IWaitPaymentContractItem[];
}

export const ContractStateString = [
    '',
    'Черновик',
    'Действующий',
    'Исполненный'
];

export const CONTRACT_STATE_ITEMS = [
    {id: CONTRACT_STATE_DRAFT, name: 'Черновик'},
    {id: CONTRACT_STATE_ACTIVE, name: 'В работе'},
    {id: CONTRACT_STATE_READY, name: 'Выполненные'}
]