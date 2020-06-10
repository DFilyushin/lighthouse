import {IContractListItem, IContract} from "../model/contract";

export interface IContractState {
    items: IContractListItem[];
    contractItem: IContract;
    isLoading: boolean;
    error: string;
    hasError: boolean
}