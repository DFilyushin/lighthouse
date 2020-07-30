import {IContractListItem, IContract, IContractListItemSimple} from "../model/contract";

export interface IContractState {
    items: IContractListItem[];
    contractItem: IContract;
    activeContracts: IContractListItemSimple[];
    isLoading: boolean;
    error: string;
    hasError: boolean;
}