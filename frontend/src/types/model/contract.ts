import {IClientItem, nullClientItem} from "./client";
import {IProduct, nullProduct} from "./product";
import {ITare, nullTare} from "./tare";
import {IEmployeeListItem, nullEmployeeItem} from "./employee";

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
    created: string | null;
    waitDate: string;
    waitSum: number;
}

export const nullWaitPaymentContractItem: IWaitPaymentContractItem = {
    id: 0,
    created: null,
    waitDate: '',
    waitSum: 0
}

export const nullContractItem: IContract = {
    id: 0,
    num: '',
    client: {...nullClientItem},
    contractDate: (new Date()).toISOString().slice(0, 10),
    delivered: '',
    contractState: CONTRACT_STATE_DRAFT,
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
    itemNds: 0,
    itemTotal: 0,
    itemDiscount: 0,
    delivered: null,
    delivery: null,
    specNum: '',
    specDate: ''
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
    delivery: string|null;
    delivered: string|null;
    specNum: string;
    specDate: string;
}

export interface IContract {
    id: number;
    created: string | undefined;
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
    {id: CONTRACT_STATE_READY, name: 'Исполненные'}
]
