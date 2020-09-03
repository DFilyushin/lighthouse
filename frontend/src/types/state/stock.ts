import {IStock} from 'types/model/stock'

export interface IStockState {
    stocks: IStock[],
    stockItem: IStock,
    isLoading: boolean,
    error: string,
    hasError: boolean
}