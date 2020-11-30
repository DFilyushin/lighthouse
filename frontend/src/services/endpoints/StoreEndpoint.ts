import BaseAPIEndpoint from "./BaseEndpoint";


class StoreEndpoint {

    /**
     * Загрузить список состояние склада сырья
     * @param date Дата, на которую формируется состояние
     * @param search Строка поиска
     */
    static getStoreRaw(date: string, search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/store/raw?onDate=${date}`
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        return url.href
    }

    /**
     * Загрузить список состояния склада готовой продукции
     * @param date Дата, на которую формируется состояние
	 * @param search Строка поиска
     */
    static getStoreProduct(date: string, search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/store/product?onDate=${date}`
        const url = new URL(baseUrl)
        if (search) url.searchParams.append('search', search);
        return url.href
    }

    /**
     * Загрузить список состояния склада ТМЦ
     * @param date Дата на которую формируется состояние склада
     * @param search Строка поиска
     */
    static getStoreStock(date: string, search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/store/stock?onDate=${date}`
        const url = new URL(baseUrl)
        if (search) url.searchParams.append('search', search)
        return url.href
    }

    /**
     * Загрузить список зарезервированной продукции на текущую дату
     */
    static getProductReserved(search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/reserve/`
        const url = new URL(baseUrl)
        if (search) url.searchParams.append('search', search);
        return url.href
    }

    /**
     * Удалить зарезервированную продукцию
     * @param id Код резерва
     */
    static deleteProductReserve(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/reserve/${id}/`
    }

    /**
     * Журнал складских операций
     * @param startDate Начальная дата
     * @param endDate Конечная дата
     * @param operType Тип операций
     */
    static getStoreJournal(startDate: string, endDate: string, operType: number, materialType: number):string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/store/journal/`;
        const url = new URL(baseUrl);
        if (startDate) url.searchParams.append('startPeriod', startDate);
        if (endDate) url.searchParams.append('endPeriod', endDate);
        url.searchParams.append('material', materialType.toString());
        url.searchParams.append('type', operType.toString());
        return url.href
    }

    /**
     * Журнал складских операций по материалу
     * @param material Код материала
     * @param onDate Дата, на которую формируется список
     */
    static getStoreByMaterial(material: number, onDate: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/store/product/${material}/`
    }


    /**
     * Запись складской операции
     * @param id Код записи
     */
    static getStoreItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/store/journal/${id}/`
    }

    /**
     * Добавить новую запись на склад
     */
    static newStoreItem(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/store/journal/`
    }

    /**
     * Удаление записи складской операции
     * @param id
     */
    static deleteStoreItem(id: number): string {
        return this.getStoreItem(id)
    }

    /**
     * Движение материалов на складе
     */
    static movementMaterial(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/store/movement/material/`
    }

    /**
     * Получить запись о резерве
     * @param id Код резерва
     */
    static getReserveItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/reserve/${id}/`
    }

    /**
     * Сохранить новый элемент резерва
     */
    static newReserveItem(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/reserve/`
    }

    /**
     * Сохранить изменения в резерве
     * @param id Код записи
     */
    static updateReserveItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/reserve/${id}/`
    }

    /**
     * Получить запись о возврате продукции
     * @param id Код записи
     */
    static getStoreReturnItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/returns/${id}/`
    }

}

export default StoreEndpoint
