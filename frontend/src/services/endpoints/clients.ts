import BaseAPIEndpoint from './BaseEndpoint'


class ClientEndpoint {
    /**
     * Получить список клиентов
     * @param search - Строка поиска
     * @param limit - количество записей в наборе
     * @param offset - сдвиг количества записей
     */
    static getClients (search?: string, limit?: number, offset?: number): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/client`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    /**
     * Получить клиента
     * @param id - Код клиента
     */
    static getClient(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/client/${id}`;
    }

    /**
     * Удалить клиента
     * @param id - Код клиента
     */
    static deleteClient(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/client/${id}`;
    }

    /**
     * Сохранить изменения в клиенте
     * @param id - Код клиента
     */
    static saveClient(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/client/${id}`;
    }

    /**
     * Новый клиент
     *
     */
    static newClient(): string{
        return `${BaseAPIEndpoint.getBaseURL()}/client/`;
    }

}

export default ClientEndpoint;
