class BaseAPIEndpoint {
    static API_URL: any = process.env.REACT_APP_HTTP_API_URL;

    /**
     * Базовый адрес API
     */
    static getBaseURL() {
        return this.API_URL;
    }
}

export default BaseAPIEndpoint;