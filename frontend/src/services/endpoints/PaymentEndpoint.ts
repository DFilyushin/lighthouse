import BaseAPIEndpoint from "./BaseEndpoint";

class PaymentEndpoint {

    /**
     * Получить список оплат
     * @param startDate Начальная дата
     * @param endDate Конечная дата
     * @param methodPayment Код метода оплат
     */
    static getPaymentList(startDate: string, endDate: string, methodPayment?: number, numContract?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/payment/`;
        const url = new URL(baseUrl);
        url.searchParams.append('start', startDate);
        url.searchParams.append('end', endDate);
        if (methodPayment) url.searchParams.append('method', methodPayment.toString());
        if (numContract) url.searchParams.append('numContract', numContract)
        return url.href
    }

    /**
     * Удалить существуюзую запись
     * @param id Код записи
     */
    static deletePayment(id: number): string {
        return this.getPaymentItem(id)
    }

    /**
     * Получить оплату по коду
     * @param id Код записи
     */
    static getPaymentItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/payment/${id}/`
    }

    /**
     * Добавить новую оплату
     */
    static addNewPayment(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/payment/`
    }

    /**
     * Обновить оплату
     * @param id Код оплаты
     */
    static updatePayment(id: number): string {
        return this.getPaymentItem(id)
    }


}
export default PaymentEndpoint