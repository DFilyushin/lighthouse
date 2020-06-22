import BaseAPIEndpoint from "./BaseEndpoint";


class UserEndpoint {

    static getUserList(active: string, search: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/user/`
    }

    static getUser(login: string): string {
        return `${BaseAPIEndpoint.getBaseURL()}/user/${login}/`
    }

    /**
     * Удалить пользователя
     * @param login
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
