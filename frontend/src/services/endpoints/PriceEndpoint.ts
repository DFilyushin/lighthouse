import BaseAPIEndpoint from "./BaseEndpoint";


class PriceEndpoint {

    /**
     * Загрузить актуальный прайс-лист
     */
    static loadPriceList(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/`
    }

    /**
     * Загрузить актуальный прайс-лист на продукт
     * @param productId Код продукта
     */
    static loadPriceListByProduct(productId: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/${productId}/`
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