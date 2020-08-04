import BaseAPIEndpoint from './BaseEndpoint'

class FormulaEndpoint {

    /**
     * Получить список рецептур
     * @param search - строка поиска
     * @param limit - ограничение вывода
     * @param offset - сдвиг при ограничении
     */
    static getFormulaList(search?: string, limit?: number, offset?: number){
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/formula/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    /**
     * Получить рецептуру по коду
     * @param id Код рецептуры
     */
    static getFormulaItem(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/formula/${id}/`
    }

    /**
     * Удалить существующую рецептуру
     * @param id
     */
    static deleteFormula(id: number){
        return this.getFormulaItem(id)
    }

    /**
     * Добавить новую рецептуру
     */
    static newFormula(){
        return `${BaseAPIEndpoint.getBaseURL()}/formula/`
    }

    /**
     * Изменить существующую рецептуру
     * @param id Код рецептуры
     */
    static saveFormula(id: number){
        return this.getFormulaItem(id)
    }

    /**
     * Калькуляция по выбранной формуле
     * @param formulaId Код формулы
     * @param count Рассчётное количество
     */
    static getCalculation(formulaId: number, count: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/formula/${formulaId}/calc/?count=${count}`
    }

}

export default FormulaEndpoint;