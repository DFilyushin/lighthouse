import {IProduct, nullProduct} from "./product";
import {IContractListItemSimple, nullContractListItemSimple} from "./contract";

export interface IReturns {
    /**
     * Код продукции в спецификации
     */
    id: number;
    /**
     * Контракт
     */
    contract: IContractListItemSimple;
    /**
     * Продукция
     */
    product: IProduct;
    /**
     * Количество продукции
     */
    count: number;
    /**
     * Дата возврата
     */
    date: string;
    /**
     * Причина возврата
     */
    cause: string;
}

export interface IReturnsList {
    /**
     * Код записи
     */
    id: number;
    /**
     * Код контракта
     */
    contractId: number;
    /**
     * Номер контракта
     */
    contractNum: string;
    /**
     * Дата контракта
     */
    contractDate: string;
    /**
     * Клиент
     */
    contractClient: string;
    /**
     * Наименование продукции
     */
    product: string;
    /**
     * Наименование тары
     */
    tare: string;
    /**
     * Количество продукции на возврат
     */
    count: number;
    /**
     * Дата оформленного возврата
     */
    date: string;
    /**
     * Сумма возврата
     */
    total: number;
}


export const nullReturnItem: IReturns = {
    id: 0,
    contract: {...nullContractListItemSimple},
    product: {...nullProduct},
    count: 0,
    date: '',
    cause: ''
}