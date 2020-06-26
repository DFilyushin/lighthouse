import {hideInfoMessage, showInfoMessage} from "./infoAction";
import GroupEndpoint from "services/endpoints/GroupEndpoint";
import UserEndpoint from "services/endpoints/UserEndpoint";
import {IAccount, IAccountListItem, IUserGroup} from "types/model/user";
import {nullEmployeeItem} from "types/model/employee";
import axios from "axios";
import {
    USER_CHANGE_ITEM,
    USER_GROUP_LOAD_SUCCESS,
    USER_LOAD_FINISH,
    USER_LOAD_ITEM_SUCCESS,
    USER_LOAD_START,
    USER_LOAD_SUCCESS,
    USER_SET_ERROR
} from "./types";


/**
 * Список пользовательских групп
 */
export function loadGroupList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        // const tareInLocalStorage = localStorage.getItem(LS_TARE_KEY);
        // if (tareInLocalStorage){
        //     const tareList = JSON.parse(tareInLocalStorage);
        //     dispatch(fetchSuccess(tareList))
        //
        // }else {
        try {
            const url = GroupEndpoint.getGroupList();
            const groupList: IUserGroup[] = [];
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                groupList.push(response.data[key])
            });
            // localStorage.setItem(LS_TARE_KEY, JSON.stringify(tareList))
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
            const response = await axios.get(url);
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
    const response = await axios.get(url)
    const result = response.data.message;
    return Promise.resolve(result === 'User exist')
}

export function getUserItem(login: string) {
    return async (dispatch: any, getState: any) => {
        let item: IAccount = {
            login: "",
            lastName: "",
            firstName: "",
            email: "",
            active: false,
            lastLogin: "",
            joined: "",
            groups: [],
            employee: nullEmployeeItem,
            isAdmin: false
        };
        dispatch(fetchStart())
        if (login === 'new') {
            dispatch(getItemSuccess(item))
        }else{
            dispatch(fetchStart());
            try{
                const response = await axios.get(UserEndpoint.getUser(login));
                item = response.data;
                dispatch(getItemSuccess(item))
            }catch (e) {
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
            await axios.post(UserEndpoint.newUser(), item);
        }catch (e) {
            console.log(e.response)
            dispatch(saveError(e.response.toString()))
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
            await axios.put(UserEndpoint.saveUser(item.login), item);
        }catch (e) {
            dispatch(saveError(e.toString()))
        }
    }
}

export function changeUserItem(item: IAccount) {
    return{
        type: USER_CHANGE_ITEM,
        item
    }
}

function saveError(error: string) {
    return{
        types: USER_SET_ERROR,
        error
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
