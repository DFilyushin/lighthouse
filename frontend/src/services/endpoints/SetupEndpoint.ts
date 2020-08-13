import BaseAPIEndpoint from "./BaseEndpoint";


class SetupEndpoint {

    /**
     * Получить полный путь к настройке
     * @param code Код настройки
     * @param type Тип данных настройки
     */
    static getSetupUrl(code: string, type: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/setup/${code}/?type=${type}`
    }

    /**
     * Получить код строковой настройки
     * @param code Код настройки
     */
    static getSetupStringValue(code: string): string {
        return this.getSetupUrl(code, 'string')
    }

    /**
     * Получить код числовой настройки
     * @param code Код настройки
     */
    static getSetupIntegerValue(code: string): string {
        return this.getSetupUrl(code, 'integer')
    }

    /**
     * Получить код точной настройки
     * @param code Код настройки
     */
    static getSetupFloatValue(code: string): string {
        return this.getSetupUrl(code, 'float')
    }

    /**
     * Получить код настройки с датой
     * @param code Код настройки
     */
    static getSetupDateValue(code: string): string {
        return this.getSetupUrl(code, 'date')
    }

    /**
     * Получить все настройки
     */
    static getAllSetup(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/setup/`
    }
}

export default SetupEndpoint