import {IContractListItemSimple} from "./contract";
import {IPayMethod} from "./paymethod";


export interface IPaymentListItem {
    id: number;
    contract: IContractListItemSimple;
    client: string;
    date: string;
    num: string;
    type: string;
    value: number;
}

export interface IPaymentItem {
    id: number;
    created: string;
    date: string;
    num: string;
    type: IPayMethod;
    value: number;
}