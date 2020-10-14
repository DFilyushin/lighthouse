import {
    IStoreRaw,
    IStoreProduct,
    IStoreJournal,
    IStoreJournalItem,
    IStoreNewMovement,
    IStoreListReserveProduct,
    IStoreReserveProduct
} from 'types/model/store'

export interface IStoreState {
    /**
     * состояние склада сырья на дату
     */
    rawStoreOnDate: string;
    /**
     * начальная дата журнала
     */
    journalStartDate: string;
    /**
     * конечная дата журнала
     */
    journalEndDate: string;
    /**
     * состояние склада готовой продукции на дату
     */
    productStoreOnDate: string;
    rawStore: IStoreRaw[];
    productStore: IStoreProduct[];
    reservedProduct: IStoreProduct[];
    storeJournal: IStoreJournal[];
    storeJournalItem: IStoreJournalItem;
    storeMovement: IStoreNewMovement;
    storeReservedList: IStoreListReserveProduct[];
    storeReserveItem: IStoreReserveProduct;
    storeMaterialJournal: IStoreJournal[];
    isLoading: boolean;
    error: string;
    hasError: boolean;
}
