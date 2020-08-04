import BaseAPIEndpoint from "./BaseEndpoint";


class ExpenseEndpoint {

    /**
     * Получить список затрат по параметрам
     * @param startDate - Дата начала
     * @param endDate - Дата окончания
     * @param idCost - Код затраты
     */
    static getExpenseList(startDate: string, endDate: string, idCost: number): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/expense/`;
        const url = new URL(baseUrl);
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);
        if (idCost) url.searchParams.append('idCost', idCost.toString());
        return url.href
    }

    /**
     * Получить затрату по коду
     * @param id Код записи
     */
    static getExpense(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/expense/${id}/`
    }

    /**
     * Новая запсись затрат
     */
    static newExpense(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/expense/`
    }

    /**
     * Удалить затраты
     * @param id Код записи
     */
    static deleteExpense(id: number): string {
        return this.getExpense(id)
    }

    /**
     * Обновить затраты
     * @param id Код записи
     */
    static updateExpense(id: number): string {
        return this.getExpense(id)
    }
}

export default ExpenseEndpoint
