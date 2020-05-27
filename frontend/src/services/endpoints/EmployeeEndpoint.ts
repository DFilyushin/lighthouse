import BaseAPIEndpoint from "./BaseEndpoint";


class EmployeeEndpoint{
    /**
     * Получить список сотрудников
     * @param search Строка поиска
     * @param limit Лимит вывода записей
     * @param offset Сдвиг
     */
    static getEmployeeList(search?: string, limit?: number, offset?: number){
        return `${BaseAPIEndpoint.getBaseURL()}/employee/`
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
}

export default EmployeeEndpoint