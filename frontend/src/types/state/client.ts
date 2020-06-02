import {IClientItemList, IClientItem} from "../model/client";
import {IContractListItem} from "../model/contract";

export interface IClientState {
    items: IClientItemList[];
    clientItem: IClientItem;
    contracts: IContractListItem[];
    isLoading: boolean;
    error: string;
    hasError: boolean
}