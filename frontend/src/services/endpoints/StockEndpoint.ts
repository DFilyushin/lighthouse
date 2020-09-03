import BaseAPIEndpoint from "./BaseEndpoint";

/**
 * Конечные точки для управления ТМЗ
 */
class StockEndpoint{

    /**
     * Получить список ТМЗ
      * @param search
     * @param limit
     * @param offset
     */
    static getStockList(search?: string, limit?: number, offset?: number){
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/stock/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    /**
     * Получить ТМЗ по коду
     * @param id Код записи
     */
    static getStockItem(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/stock/${id}/`
    }

    /**
     * Удалить ТМЗ по коду
     * @param id Код записи
     */
    static deleteStock(id: number){
        return this.getStockItem(id)
    }

    /**
     * Добавить новый ТМЗ
     */
    static newStock(){
        return `${BaseAPIEndpoint.getBaseURL()}/stock/`
    }

    /**
     * Сохранить изменения в ТМЗ
     * @param id Код записи
     */
    static saveStock(id: number){
        return this.getStockItem(id)
    }
}

export default StockEndpoint;