import BaseAPIEndpoint from "./BaseEndpoint";


export class ReturnsEndpoint {

    /**
     * Получить список возвратов
     * @param start Начало периода
     * @param end Окончание периода
     */
    static getReturnList(start: string, end: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/returns/`;
        const url = new URL(baseUrl);
        url.searchParams.append('start', start);
        url.searchParams.append('end', end);
        return url.href
    }

    /**
     * Получить возврат по существующему коду записи
     * @param id Код записи
     */
    static getReturnItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/returns/${id}`
    }
}