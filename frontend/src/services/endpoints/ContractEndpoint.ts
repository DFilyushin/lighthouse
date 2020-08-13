import BaseAPIEndpoint from './BaseEndpoint'

export const UNDEFINED_AGENT = 0

class ContractEndpoint {

    /**
     * Получить список контрактов
     * @param state Состояние контракта
     */
    static getContractList(state: number, byAgent: number, search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/contract/`;
        const url = new URL(baseUrl);
        if (state) url.searchParams.append('state', state.toString());
        if (search) url.searchParams.append('search', search)
        if (byAgent !== UNDEFINED_AGENT) url.searchParams.append('byAgent', byAgent.toString())
        return url.href
    }

    /**
     * Получить список активных контрактов
     */
    static getActiveContractList(num: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/contract/active?num=${num}`
    }

    /**
     * Получить контракт
     * @param id
     */
    static getContract(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/contract/${id}/`
    }

    /**
     * Установить статус контракта
     * @param id Код контракта
     * @param newStatus Код статуса
     */
    static setContractStatus(id: number, newStatus: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/contract/${id}/setStatus/${newStatus}/`
    }


    /**
     * Удалить контракт
     * @param id
     */
    static deleteContract(id: number): string {
        return this.getContract(id)
    }

    /**
     * Удалить контракт
     * @param id
     */
    static updateContract(id: number): string {
        return this.getContract(id)
    }

    /**
     * Новый контракт
     */
    static newContract(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/contract/`
    }


}

export default ContractEndpoint;