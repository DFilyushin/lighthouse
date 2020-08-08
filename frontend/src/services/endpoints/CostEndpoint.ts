import BaseAPIEndpoint from "./BaseEndpoint";

class CostEndpoint {


    /**
     * Список затрат
     */
    static getCostList(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/cost/`
    }

    /**
     * Список затрат второго уровня
     */
    static getCostFlatList(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/cost/flat/`
    }


    /**
     * Получить затрату
     * @param id Код затраты
     */
    static getCostItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/cost/${id}/`
    }


    /**
     * Удалить затрату
     * @param id Код затраты
     */
    static deleteCost(id: number): string {
        return this.getCostItem(id)
    }

    /**
     *
     * @param id
     */
    static updateCost(id: number): string {
        return this.getCostItem(id)
    }

    static newCost(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/cost/`
    }
}

export default CostEndpoint;