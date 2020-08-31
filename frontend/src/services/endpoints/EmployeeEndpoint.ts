import BaseAPIEndpoint from "./BaseEndpoint";


class EmployeeEndpoint{
    /**
     * Получить список сотрудников
     * @param showFired Отображать уволенных
     * @param search Строка поиска
     * @param limit Лимит вывода записей
     * @param offset Сдвиг
     */
    static getEmployeeList(showFired: boolean = false, search?: string, limit?: number,  offset?: number){
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/employee/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (showFired) url.searchParams.append('fired', 'on');
        return url.href
    }

    /**
     * Получить сотрудника по коду записи
     * @param id Код записи
     */
    static getEmployeeItem(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/employee/${id}/`
    }

    /**
     * Добавить нового сотрудника
     */
    static newEmployee(){
        return `${BaseAPIEndpoint.getBaseURL()}/employee/`
    }

    /**
     * Удалить сотрудника
     * @param id Код сотрудника
     */
    static deleteEmployee(id: number){
        return this.getEmployeeItem(id)
    }

    /**
     * Изменить сотрудника
     * @param id Код сотрудника
     */
    static updateEmployee(id: number){
        return this.getEmployeeItem(id)
    }

    /**
     * Отработанное сотрудником время
     * @param id Код сотрудника
     * @param start Начало периода
     * @param end Окончание периода
     */
    static getEmployeeWorkTime(id: number, start: string, end: string) {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/employee/${id}/works`
        const url = new URL(baseUrl);
        url.searchParams.append('start', start);
        url.searchParams.append('end', end)
        return url.href
    }

    /**
     * Получить список сотрудников не имеющих учётные данные в системе
     */
    static getEmployeeWithoutUsername(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/employee/noLogins/`
    }
}

export default EmployeeEndpoint