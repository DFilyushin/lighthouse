import BaseAPIEndpoint from "./BaseEndpoint";


class TareEndpoint{

    /**
     * Получить список
     * @param search Строка поиска
     * @param limit лимит вывода записей
     * @param offset сдвиг
     */
    static getTareList(search?: string, limit?: number, offset?: number): string{
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/tare/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    /**
     * Получить объект по коду
     * @param id Код тары
     */
    static getTareItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/tare/${id}/`
    }

    /**
     * Удалить по коду
     * @param id код тары
     */
    static deleteTare(id: number): string {
        return this.getTareItem(id)
    }

    /**
     * Добавить новый объект тары
     */
    static newTare(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/tare/`
    }

    static saveTare(id: number): string {
        return this.getTareItem(id)
    }

}
export default TareEndpoint;
