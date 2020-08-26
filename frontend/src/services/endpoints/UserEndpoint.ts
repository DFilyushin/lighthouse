import BaseAPIEndpoint from "./BaseEndpoint";


class UserEndpoint {

    /**
     * Список пользователей
     * @param active признак активности пользователей
     * @param search Поиск по логину
     */
    static getUserList(active: string, search: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/user/`;
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
    static saveUser(login: string): string {
        return this.getUser(login)
    }

    /**
     * Новый пользователь
     */
    static newUser(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/user/`
    }

    /**
     * Проверка существования логина
     * @param login
     */
    static checkUserLogin(login: string) {
        return `${BaseAPIEndpoint.getBaseURL()}/user/check?login=${login}`
    }

    /**
     * Получить профиль пользователя
     */
    static getProfile(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/profile/`
    }


    /**
     * Сохранить профиль пользователя
     */
    static saveProfile(): string {
        return this.getProfile()
    }

    /**
     * Смена пароля пользователя
     */
    static changePassword(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/change_password/`
    }

}

export default UserEndpoint
