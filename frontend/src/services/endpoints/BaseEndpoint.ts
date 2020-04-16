class BaseAPIEndpoint {
    static API_URL: string = 'http://localhost:8000';

    /**
     * Базовый адрес API
     */
    static getBaseURL() {
        return this.API_URL;
    }
}

export default BaseAPIEndpoint;