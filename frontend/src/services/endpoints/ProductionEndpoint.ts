import BaseAPIEndpoint from "./BaseEndpoint";


class ProductionEndpoint{

    /**
     * Список производственных карт
     * @param startPeriod Начала периода
     * @param endPeriod Окончание периода
     * @param productId Код продукта
     * @param state Состояние карты
     */
    static getProductionList(startPeriod: string, endPeriod: string, productId?: number, state?: number ): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/prod`;
        const url = new URL(baseUrl);
        if (productId) url.searchParams.append('product', productId.toString());
        if (state) url.searchParams.append('state', state.toString());
        if (startPeriod) url.searchParams.append('startPeriod', startPeriod);
        if (endPeriod) url.searchParams.append('endPeriod', endPeriod);
        return url.href
    }

    /**
     * Новая карта
     */
    static newProductionCard(): string{
        return `${BaseAPIEndpoint.getBaseURL()}/prod/`
    }

    /**
     * Получить карту по коду
     * @param id Код карты
     */
    static getProductionCard(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/prod/${id}/`;
    }

    /**
     * Удалить имеющуюся карту
     * @param id Код карты
     */
    static deleteProductionCard(id: number): string{
        return this.getProductionCard(id);
    }

    /**
     * Сохранить изменения в карте
     * @param id Код карты
     */
    static saveProductionCard(id: number): string{
        return this.getProductionCard(id);
    }

    /**
     * Получить состав смены в техн. карте
     * @param id Код карты
     */
    static getProductionTeam(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/prod/${id}/team/`;
    }

    /**
     * Получить калькуляция на техн. карту
     * @param id Код карты
     */
    static getProductionCalc(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/prod/${id}/calc/`;
    }

    /**
     * Получить список готовой продукции в таре
     * @param id
     */
    static getProductionTare(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/prod/${id}/tare/`;
    }
}

export  default ProductionEndpoint;
