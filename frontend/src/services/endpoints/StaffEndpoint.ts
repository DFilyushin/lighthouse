import BaseAPIEndpoint from "./BaseEndpoint";


class StaffEndpoint {

    /**
     * Удаление элемента
     * @param id
     */
    static deleteItem(id: number): string {
        return this.getStaffItem(id);
    }

    /**
     * Получить элемент
     * @param id
     */
    static getStaffItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/staff/${id}/`;
    }

    /**
     * Получить список записей
     * @param search строка поиска
     * @param limit ограничение записей
     * @param offset сдвиг
     */
    static getStaffList(search?: string, limit?: number, offset?: number): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/staff/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    /**
     * Добавление новой записи
     */
    static newStaff(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/staff/`;
    }

    /**
     * Обновление записи
     * @param id код  записи
     */
    static saveStaff(id: number): string {
        return this.getStaffItem(id);
    }
}

export default StaffEndpoint