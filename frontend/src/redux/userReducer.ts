import {IUserState} from "../types/state/user";
import {nullEmployeeItem} from "../types/model/employee";
import {
    USER_CHANGE_ITEM,
    USER_GROUP_LOAD_SUCCESS,
    USER_LOAD_FINISH,
    USER_LOAD_ITEM_SUCCESS,
    USER_LOAD_START,
    USER_LOAD_SUCCESS,
    USER_PROFILE_OK
} from "./actions/types";
import {nullProfile} from "../types/model/user";

const initState = (): IUserState => ({
    groups: [],
    userItems: [],
    isLoading: false,
    hasError: false,
    error: '',
    userAccount: {
        groups: [],
        joined: "",
        login: "",
        active: false,
        email: "",
        employee: nullEmployeeItem,
        firstName: "",
        lastName: "",
        lastLogin: "",
        isAdmin: false,
        password: ''
    },
    userProfile: nullProfile
});

export const userReducer = (state: IUserState = initState(), action: any) => {
    switch (action.type) {
        case USER_LOAD_START:
            return {...state, isLoading: true}
        case USER_LOAD_FINISH:
            return {...state, isLoading: false}
        case USER_LOAD_SUCCESS:
            return {...state, userItems: action.items}
        case USER_LOAD_ITEM_SUCCESS:
            return {...state, userAccount: action.item}
        case USER_CHANGE_ITEM:
            return {...state, userAccount: action.item}
        case USER_GROUP_LOAD_SUCCESS:
            return {...state, groups: action.items}
        case USER_PROFILE_OK:
            return {...state, userProfile: action.profile}
        default: return state;
    }
}
