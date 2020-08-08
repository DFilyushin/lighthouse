import BaseAPIEndpoint from "./BaseEndpoint";


class DepartmentEndpoint{

    /**
     * Получить список подразделений
     * @param search строка поиска
     * @param limit лимит вывода записей
     * @param offset сдвиг
     */
    static getDepartmentList(search?: string, limit?: number, offset?: number){
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/department/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        return url.href
    }

    /**
     * Получить подразделение по коду
     * @param id Код записи
     */
    static getDepartment(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/department/${id}/`
    }

    /**
     * Удалить подразделение
     * @param id Код записи
     */
    static deleteDepartment(id: number){
        return this.getDepartment(id)
    }

    /**
     * Добавить новое подразделение
     */
    static newDepartment(){
        return `${BaseAPIEndpoint.getBaseURL()}/department/`
    }

    /**
     * Обновление подразделения
     * @param id Код записи
     */
    static updateDepartment(id: number){
        return this.getDepartment(id)
    }
}

export default DepartmentEndpoint;