import {IPrice} from "../model/price";

export interface IPriceState {
    priceList: IPrice[];
    priceListEmployee: IPrice[];
    priceListHistory: IPrice[];
    priceItem: IPrice;
    isLoading: boolean;
    error: string;
    hasError: boolean;
}
