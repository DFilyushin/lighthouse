import {hideInfoMessage, showInfoMessage} from "./infoAction";
import UserEndpoint from "../../services/endpoints/UserEndpoint";
import {IUnit} from "../../types/model/unit";
import axios from "axios";
import {USER_LOAD_FINISH, USER_LOAD_ITEM_SUCCESS, USER_LOAD_START, USER_LOAD_SUCCESS} from "./types";
import {IAccount, IAccountListItem} from "../../types/model/user";
import UnitEndpoint from "../../services/endpoints/UnitEndpoint";
import {nullEmployeeItem} from "../../types/model/employee";


export function getUserList(showOnlyActive: boolean, search: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        const active: string = showOnlyActive ? "on" : "off"
        // const tareInLocalStorage = localStorage.getItem(LS_TARE_KEY);
        // if (tareInLocalStorage){
        //     const tareList = JSON.parse(tareInLocalStorage);
        //     dispatch(fetchSuccess(tareList))
        //
        // }else {
        try {
            const url = UserEndpoint.getUserList(active, search);
            const userList: IAccountListItem[] = [];
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                userList.push(response.data[key])
            });
            // localStorage.setItem(LS_TARE_KEY, JSON.stringify(tareList))
            dispatch(fetchSuccess(userList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        // }
        dispatch(fetchFinish())
    }
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
            employee: nullEmployeeItem
        };
        dispatch(fetchStart())
        if (login === '') {
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