import BaseAPIEndpoint from "./BaseEndpoint";


class StoreEndpoint {

    /**
     * Загрузить список состояние склада сырья
     * @param date Дата, на которую формируется состояние
     */
    static getStoreRaw(date: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/store/raw?onDate=${date}`
    }

    /**
     * Загрузить список состояния склада готовой продукции
     * @param date Дата, на которую формируется состояние
     */
    static getStoreProduct(date: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/store/product?onDate=${date}`
    }
}

export default StoreEndpoint
