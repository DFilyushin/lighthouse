import BaseAPIEndpoint from "./BaseEndpoint";


class FactoryLineEndpoint {

    /**
     * Список линий производства
     */
    static getFactoryLinesList(search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/prodline/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        return url.href
    }

    /**
     * Получить объект линии производства
     * @param id - Код записи
     */
    static getFactoryLineItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/prodline/${id}/`
    }

    /**
     * Удалить линию производства
     * @param id - Код записи
     */
    static deleteFactoryLine(id: number): string{
        return this.getFactoryLineItem(id)
    }

    /**
     * Сохранить изменения в записи
     * @param id - КОд записи
     */
    static saveFactoryLine(id: number): string {
        return this.getFactoryLineItem(id)
    }

    /**
     * Новая запись
     */
    static newFactoryLine(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/prodline/`
    }
}

export default FactoryLineEndpoint;
