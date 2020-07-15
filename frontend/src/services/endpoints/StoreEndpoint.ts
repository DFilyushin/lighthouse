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


    /**
     * Журнал складских операций
     * @param startDate Начальная дата
     * @param endDate Конечная дата
     * @param operType Тип операций
     */
    static getStoreJournal(startDate: string, endDate: string, operType: number):string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/store/journal`;
        const url = new URL(baseUrl);
        if (startDate) url.searchParams.append('startPeriod', startDate);
        if (endDate) url.searchParams.append('endPeriod', endDate);
        url.searchParams.append('type', operType.toString());
        return url.href
    }
}

export default StoreEndpoint
