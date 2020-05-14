import BaseAPIEndpoint from "./BaseEndpoint";

class UnitEndpoint{

    /**
     * Получить список объектов
     * @param search строка поиска
     * @param limit лимит вывода
     * @param offset сдвиг
     */
    static getUnits(search?: string, limit?: number, offset?: number) {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/units/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    /**
     * Получить объект по коду
     * @param id Код записи
     */
    static getUnitItem(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/units/${id}/`
    }

    /**
     * Удаление записи
     * @param id Код записи
     */
    static deleteUnit(id: number){
        return this.getUnitItem(id)
    }

    /**
     * Добавление нового объекта
     */
    static newUnit(){
        return `${BaseAPIEndpoint.getBaseURL()}/units/`
    }

    /**
     * Изменение записи
     * @param id Код записи
     */
    static saveUnit(id: number){
        return this.getUnitItem(id)
    }
}

export default UnitEndpoint;