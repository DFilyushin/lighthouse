import BaseAPIEndpoint from './BaseEndpoint'


class AuthEndpoint {

    /**
     * Авторизация
     */
    static getAuth(){
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/api/auth/`;
        return baseUrl;
    }

    /**
     * Обновить токен
     */
    static getUpdateToken(){
        return `${BaseAPIEndpoint.getBaseURL()}/api/refresh_token`;
    }

}

export default AuthEndpoint;