import {IPrice} from "../model/price";

export interface IPriceState {
    priceList: IPrice[];
    priceItem: IPrice;
    isLoading: boolean;
    error: string;
    hasError: boolean;
}