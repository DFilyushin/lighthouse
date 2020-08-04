import BaseAPIEndpoint from './BaseEndpoint'


class AuthEndpoint {

    /**
     * Авторизация
     */
    static getAuth(){
        return `${BaseAPIEndpoint.getBaseURL()}/api/auth/`;
    }

    /**
     * Обновление токена
     */
    static getUpdateToken(){
        return `${BaseAPIEndpoint.getBaseURL()}/api/refresh_token/`;
    }

}

export default AuthEndpoint;