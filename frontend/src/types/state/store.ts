import {
    IStoreRaw,
    IStoreProduct,
    IStoreJournal,
    IStoreJournalItem,
    IStoreNewMovement,
    IStoreListReserveProduct,
    IStoreReserveProduct,
    IStoreStock, IStoreReturnProduct
} from 'types/model/store'

export interface IStoreState {
    /**
     * состояние склада сырья на дату
     */
    rawStoreOnDate: string;
    /**
     * Состояние склада ТМЦ на дату
     */
    stockStoreOnDate: string;
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
    /**
     * Состояние склада сырья
     */
    rawStore: IStoreRaw[];
    /**
     * Состояние склада продукции
     */
    productStore: IStoreProduct[];
    /**
     * Состояние склада ТМЦ
     */
    stockStore: IStoreStock[];
    /**
     * Резерв продукции
     */
    reservedProduct: IStoreProduct[];
    storeJournal: IStoreJournal[];
    storeJournalItem: IStoreJournalItem;
    storeMovement: IStoreNewMovement;
    storeReservedList: IStoreListReserveProduct[];
    storeReserveItem: IStoreReserveProduct;
    storeMaterialJournal: IStoreJournal[];
    /**
     * Возврат продукции
     */
    storeReturnItem: IStoreReturnProduct;
    isLoading: boolean;
    error: string;
    hasError: boolean;
}
