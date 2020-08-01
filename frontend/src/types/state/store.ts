import {
    IStoreRaw,
    IStoreProduct,
    IStoreJournal,
    IStoreJournalItem,
    IStoreNewMovement,
    IStoreListReserveProduct, IStoreReserveProduct
} from 'types/model/store'

export interface IStoreState {
    rawStoreOnDate: string; // состояние склада сырья на дату
    journalStartDate: string; // начальная дата журнала
    journalEndDate: string; // конечная дата журнала
    productStoreOnDate: string; // состояние склада готовой продукции на дату
    rawStore: IStoreRaw[];
    productStore: IStoreProduct[];
    reservedProduct: IStoreProduct[];
    storeJournal: IStoreJournal[];
    storeJournalItem: IStoreJournalItem;
    storeMovement: IStoreNewMovement;
    storeReservedList: IStoreListReserveProduct[];
    storeReserveItem: IStoreReserveProduct;
    isLoading: boolean;
    error: string;
    hasError: boolean;
}
