class BaseAPIEndpoint {
    static API_URL: any = process.env.REACT_APP_HTTP_API_URL;

    /**
     * Базовый адрес API
     */
    static getBaseURL(): string {
        return this.API_URL;
    }
}

export default BaseAPIEndpoint;