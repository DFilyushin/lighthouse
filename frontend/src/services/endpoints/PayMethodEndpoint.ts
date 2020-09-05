import BaseAPIEndpoint from "./BaseEndpoint";


class PayMethodEndpoint {

    /**
     * Получить список методов оплаты
     */
    static getPayMethodList(search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/paymethod/`
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        return url.href
    }

    /**
     * Получить объект метода оплаты
     * @param id Код записи
     */
    static getPayMethod(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/paymethod/${id}/`
    }

    /**
     * Удалить метод оплаты
     * @param id Код записи
     */
    static deletePayMethod(id: number): string {
        return this.getPayMethod(id)
    }


    /**
     * Обновить метод оплаты
     * @param id Код записи
     */
    static updatePayMethod(id: number): string {
        return this.getPayMethod(id)
    }

    /**
     * Новый метод оплаты
     */
    static newPayMethod(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/paymethod/`
    }
}

export default PayMethodEndpoint
