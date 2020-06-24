import BaseAPIEndpoint from "./BaseEndpoint";


class UserEndpoint {

    /**
     * Список пользователей
     * @param active признак активности пользователей
     * @param search Поиск по логину
     */
    static getUserList(active: string, search: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/user`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (active) url.searchParams.append('active', active);
        return url.href
    }

    /**
     * Получить объект пользователя
     * @param login Логин пользователя
     */
    static getUser(login: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/user/${login}/`
    }

    /**
     * Удалить пользователя
     * @param login Логин пользователя
     */
    static deleteUser(login: string): string {
        return this.getUser(login)
    }

    /**
     * Обновление пользователя
     * @param login
     */
    static updateUser(login: string): string {
        return this.getUser(login)
    }

    /**
     * Новый пользователь
     */
    static newUser(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/user/`
    }

}

export default UserEndpoint