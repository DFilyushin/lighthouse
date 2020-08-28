import authAxios from "../../services/axios-api";
import NotificationEndpoint from "../../services/endpoints/NotificationEndpoint";
import {INotification} from "../../types/model/notification";
import {NOTICE_LOAD_OK} from "./types";
import {showInfoMessage} from "./infoAction";


/**
 * Получить список уведомлений
 */
export function loadNotification() {
    return async (dispatch: any, getState: any) => {
        const items: INotification[] = [];
        try{
            const response = await authAxios.get(NotificationEndpoint.getNotifications())
            Object.keys(response.data).forEach((key) => {
                items.push({...response.data[key]})
            })
            dispatch(loadNotificationSuccess(items))
        }catch (e) {
            console.log('Error loading notification', e.toString())
            dispatch(dispatch(showInfoMessage("error", 'Не удалось загрузить уведомления!')))
        }
    }
}

/**
 * Успешная загрузка списка уведомлений
 * @param items Список уведомлений
 */
function loadNotificationSuccess(items: INotification[]) {
    return{
        type: NOTICE_LOAD_OK,
        items
    }
}