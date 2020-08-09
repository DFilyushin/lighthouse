import BaseAPIEndpoint from './BaseEndpoint'

class ContractEndpoint {

    /**
     * Получить список контрактов
     * @param state Состояние контракта
     */
    static getContractList(state: number, search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/contract/`;
        const url = new URL(baseUrl);
        if (state) url.searchParams.append('state', state.toString());
        if (search) url.searchParams.append('search', search)
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