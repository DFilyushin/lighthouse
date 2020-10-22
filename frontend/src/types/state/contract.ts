import {IContractListItem, IContract, IContractListItemSimple} from "../model/contract";

export interface IContractState {
    contractItems: IContractListItem[];
    contractItem: IContract;
    activeContracts: IContractListItemSimple[];
    isLoading: boolean;
    error: string;
    hasError: boolean;
    showOwnContract: boolean;
    contractNotFound: boolean;
}
