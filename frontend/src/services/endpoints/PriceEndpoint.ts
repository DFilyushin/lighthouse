import BaseAPIEndpoint from "./BaseEndpoint";


class PriceEndpoint {

    /**
     * Загрузить актуальный прайс-лист
     */
    static loadPriceList(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/`
    }

    /**
     * Загрузить прайс-лист по коду записи
     * @param id Код записи
     */
    static loadPriceById(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/${id}/`
    }

    /**
     * Удалить прайс-лист по коду продукта и дате
     * @param productId Код продукта
     * @param date Дата прайса
     */
    static deletePriceList(productId: number, date: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/`
    }
}

export default PriceEndpoint