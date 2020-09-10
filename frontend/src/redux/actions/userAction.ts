import {hideInfoMessage, showInfoMessage} from "./infoAction";
import GroupEndpoint from "services/endpoints/GroupEndpoint";
import UserEndpoint from "services/endpoints/UserEndpoint";
import {IAccount, IAccountListItem, IProfile, IUserGroup, nullAccountItem} from "types/model/user";
import {
    USER_CHANGE_ITEM,
    USER_GROUP_LOAD_SUCCESS,
    USER_LOAD_FINISH,
    USER_LOAD_ITEM_SUCCESS,
    USER_LOAD_START,
    USER_LOAD_SUCCESS,
    USER_PROFILE_OK,
    USER_SET_NOFOUND_USER
} from "./types";
import authAxios from "../../services/axios-api";
import {NEW_RECORD_TEXT} from "../../utils/AppConst";


/**
 * Список пользовательских групп
 */
export function loadGroupList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        try {
            const url = GroupEndpoint.getGroupList();
            const groupList: IUserGroup[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                groupList.push(response.data[key])
            });
            dispatch(fetchGroupSuccess(groupList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        // }
        dispatch(fetchFinish())
    }
}

/**
 * Список пользователей системы
 * @param showOnlyActive Отображать только активных пользователей
 * @param search Поиск по логину
 */
export function loadUserList(showOnlyActive: boolean, search: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        const active: string = showOnlyActive ? "on" : "off"
        try {
            const url = UserEndpoint.getUserList(active, search);
            const userList: IAccountListItem[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                userList.push(response.data[key])
            });
            dispatch(fetchSuccess(userList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Проверить существование логина
 * @param login Проверяемый логин
 * return - True - пользователь существует, False - отсутствует
 */
export async function checkUserExist(login: string) {
    const url = UserEndpoint.checkUserLogin(login)
    const response = await authAxios.get(url)
    const result = response.data.message;
    return Promise.resolve(result === 'User exist')
}

/**
 * Получить существующего пользователя по логину
 * @param login Логин существующего пользователя
 */
export function getUserItem(login: string) {
    return async (dispatch: any, getState: any) => {
        let item: IAccount = {...nullAccountItem};
        dispatch(fetchStart())
        if (login === NEW_RECORD_TEXT) {
            dispatch(setUserNotFound(false))
            dispatch(getItemSuccess(item))
        }else{
            dispatch(fetchStart());
            try{
                const response = await authAxios.get(UserEndpoint.getUser(login));
                item = response.data;
                dispatch(getItemSuccess(item))

            }catch (e) {
                if (e.response.status === 404){
                    dispatch(setUserNotFound(true))
                }
                dispatch(showInfoMessage('error', e.toString()))
            }
            dispatch(fetchFinish())
        }
    }
}

/**
 * Новый пользователь
 * @param item
 */
export function addUser(item: IAccount) {
    return async (dispatch: any, getState: any) => {
        try{
            const postItem = {...item}
            await authAxios.post(UserEndpoint.newUser(), {...postItem, 'employee': postItem.employee.id});
        }catch (e) {
            console.log('Error save new user. Error message:', e.response)
            const  errorMessage = `Не удалось добавить нового пользователя по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

/**
 * Сохранить изменения
 * @param item
 */
export function saveUser(item: IAccount) {
    return async (dispatch: any, getState: any) => {
        try{
            const postItem = {...item}
            const idEmployee = postItem.employee.id
            await authAxios.put(UserEndpoint.saveUser(item.login), {...postItem, 'employee': idEmployee});
        }catch (e) {
            console.log('Error update user. Error message:', e.response)
            const  errorMessage = `Не удалось обновить данные пользователя по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

/**
 * Удаление пользователя
 * @param login
 */
export function deleteUser(login: string) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.delete(UserEndpoint.deleteUser(login))
            const items = [...getState().user.userItems];
            const index = items.findIndex((elem)=>{return elem.login === login});
            items.splice(index, 1);
            dispatch(deleteOk(items));

        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Загрузить пользовательский профиль
 */
export function loadUserProfile() {
    return async (dispatch: any, getState: any)=> {
        try{
            const response = await authAxios.get(UserEndpoint.getProfile());
            const item: IProfile = response.data;
            dispatch(successLoadUserProfile(item))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Сохранить профиль пользователя
 * @param profile Объект профиля пользователя
 */
export function saveUserProfile(profile: IProfile) {
    return async (dispatch: any, getState: any) => {
        try {
            await authAxios.put(UserEndpoint.saveProfile(), profile)

            localStorage.setItem('lastName', profile.lastName)
            localStorage.setItem('firstName', profile.firstName)

            dispatch(showInfoMessage('info', 'Данные успешно сохранены!'))
            return Promise.resolve()
        }catch (e) {
            const text = e.response.data['message']
            throw new Error(text)
        }

    }
}

/**
 * Изменить пароль текущего пользователя
 */
export function changePassword(new_password: string) {
    return async (dispatch: any, getState: any)=> {
        try{
            await authAxios.put(UserEndpoint.changePassword(), {'password': new_password})
            return Promise.resolve()
        }catch (e) {
            const text = e.response.data['message']
            console.log('error in action:', text)
            throw new Error(text)
        }
    }

}

export function changeProfile(profile: IProfile) {
    return async (dispatch: any, getState: any) => {
        dispatch(successLoadUserProfile(profile))
    }
}

function successLoadUserProfile(profile: IProfile) {
    return{
        type: USER_PROFILE_OK,
        profile
    }
}

export function changeUserItem(item: IAccount) {
    return{
        type: USER_CHANGE_ITEM,
        item
    }
}

function deleteOk(items: IAccount[]) {
    return{
        type: USER_LOAD_SUCCESS,
        items
    }
}

function fetchStart() {
    return{
        type: USER_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: USER_LOAD_FINISH
    }
}

function fetchSuccess(items: IAccountListItem[]) {
    return{
        type: USER_LOAD_SUCCESS,
        items
    }
}

function getItemSuccess(item: IAccount) {
    return{
        type: USER_LOAD_ITEM_SUCCESS,
        item
    }
}


function fetchGroupSuccess(items: IUserGroup[]) {
    return{
        type: USER_GROUP_LOAD_SUCCESS,
        items
    }
}

function setUserNotFound(value: boolean) {
    return{
        type: USER_SET_NOFOUND_USER,
        value
    }
}
