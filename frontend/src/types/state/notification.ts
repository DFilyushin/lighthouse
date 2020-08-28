import {INotification} from "../model/notification";

export interface INoticeState {
    /**
     * Список уведомлений
     */
    notices: INotification[]
}