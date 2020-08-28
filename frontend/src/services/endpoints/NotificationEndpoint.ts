import BaseAPIEndpoint from "./BaseEndpoint";


class NotificationEndpoint {

    /**
     * Получить список уведомлений
     */
    static getNotifications (): string{
        return `${BaseAPIEndpoint.getBaseURL()}/notification/`
    }
}

export default NotificationEndpoint