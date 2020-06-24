import {IUserState} from "../types/state/user";
import {nullEmployeeItem} from "../types/model/employee";
import {USER_LOAD_FINISH, USER_LOAD_ITEM_SUCCESS, USER_LOAD_START, USER_LOAD_SUCCESS} from "./actions/types";

const initState = (): IUserState => ({
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
        lastLogin: ""
    }
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
        default: return state;
    }
}