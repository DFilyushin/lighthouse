import BaseAPIEndpoint from "./BaseEndpoint";


class PriceEndpoint {

    /**
     * Загрузить актуальный прайс-лист
     */
    static loadPriceList(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/`
    }

    /**
     * Загрузить актуальный прайс-лист по менеджеру
     * @param employeeId Код менеджера
     */
    static loadPriceListByEmployee(employeeId: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/employee/${employeeId}/`
    }

    /**
     * Загрузить прайс-лист по коду записи
     * @param id Код записи
     */
    static loadPriceById(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/${id}/`
    }

    /**
     * История прайс-листов по продукции
     * @param productId Код продукции
     */
    static loadPriceByProduct(productId: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/history/${productId}/`
    }

    /**
     * Удалить прайс-лист по коду продукта и дате
     * @param id Код прайса
     */
    static deletePriceList(id: number): string {
        return this.loadPriceById(id)
    }

    /**
     * Обновление прайс-листа по коду записи
     * @param id Код записи
     */
    static updatePriceList(id: number): string{
        return this.loadPriceById(id)
    }

    /**
     * Добавить новый прайс-лист
     */
    static newPriceList(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/`
    }

    /**
     * Создать прайс-лист по шаблону для менеджера
     * @param employeeId Код сотрудника/менеджера
     */
    static newPriceListByTemplate(employeeId: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/price/employee/${employeeId}/`
    }
}

export default PriceEndpoint
