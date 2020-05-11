import BaseAPIEndpoint from "./BaseEndpoint";


class TareEndpoint{

    /**
     * Получить список
     * @param search Строка поиска
     * @param limit лимит вывода записей
     * @param offset сдвиг
     */
    static getTareList(search?: string, limit?: number, offset?: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/tare/`
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
    static getDeleteTare(id: number): string {
        return this.getTareItem(id)
    }

    /**
     * Добавить новый объект тары
     */
    static newTare(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/tare/`
    }

    static updateTare(id: number): string {
        return this.getTareItem(id)
    }

}
export default TareEndpoint;
