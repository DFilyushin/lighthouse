import {IStoreRaw, IStoreProduct, IStoreJournal} from 'types/model/store'

export interface IStoreState {
    rawStoreOnDate: string; // состояние склада сырья на дату
    journalStartDate: string; // начальная дата журнала
    journalEndDate: string; // конечная дата журнала
    productStoreOnDate: string; // состояние склада готовой продукции на дату
    rawStore: IStoreRaw[];
    productStore: IStoreProduct[];
    reservedProduct: IStoreProduct[];
    storeJournal: IStoreJournal[];
    storeJournalItem: IStoreJournal;
    isLoading: boolean;
    error: string;
    hasError: boolean;
}
