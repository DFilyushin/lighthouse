import {IContractListItemSimple} from "./contract";
import {IPayMethod} from "./paymethod";


export interface IPaymentListItem {
    id: number;
    contract: IContractListItemSimple;
    date: string;
    num: string;
    type: string;
    value: number;
}

export interface IPaymentItem {
    id: number;
    created: string | undefined | null;
    contract: IContractListItemSimple;
    date: string;
    num: string;
    method: IPayMethod;
    value: number;
}

export const nullPaymentItem: IPaymentItem = {
    id: 0,
    created: '',
    contract: {
        id: 0,
        num: '',
        client: '',
        date: ''
    },
    date: (new Date()).toISOString().slice(0, 10),
    num: '',
    method: {
        id: 0,
        name: ''
    },
    value: 0
}