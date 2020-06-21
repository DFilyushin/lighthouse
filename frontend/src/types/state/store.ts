import {IStoreRaw, IStoreProduct} from 'types/model/store'

export interface IStoreState {
    rawStoreOnDate: string; // состояние склада сырья на дату
    productStoreOnDate: string; // состояние склада готовой продукции на дату
    rawStore: IStoreRaw[];
    productStore: IStoreProduct[];
    reservedProduct: IStoreProduct[];
    isLoading: boolean;
    error: string;
    hasError: boolean;
}
