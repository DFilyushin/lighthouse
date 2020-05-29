import {IClientItemList, IClientItem} from "../model/client";

export interface IClientState {
    items: IClientItemList[];
    clientItem: IClientItem;
    isLoading: boolean;
    error: string;
    hasError: boolean
}