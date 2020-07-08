import BaseAPIEndpoint from "./BaseEndpoint";

export class WorkEndpoint {

    /**
     * Получить список работ
     * @param search Поисковая строка
     */
    static getWorkList (search?: string) {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/works/`
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        return url.href
    }

    /**
     * Получить элемент по коду
     * @param id Код элемента
     */
    static getWorkItem(id: number) {
        return `${BaseAPIEndpoint.getBaseURL()}/works/${id}/`
    }

    /**
     * Добавить новый элемент
     */
    static newWorkItem() {
        return `${BaseAPIEndpoint.getBaseURL()}/works/`
    }

    /**
     * Удалить существующий элемент
     * @param id Код элемента
     */
    static deleteWorkItem(id: number) {
        return this.getWorkItem(id)
    }

    /**
     * Обновить существующий элемент
     * @param id Код элемента
     */
    static updateWorkItem(id: number) {
        return this.getWorkItem(id)
    }
}
