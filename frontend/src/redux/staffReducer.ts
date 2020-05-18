import {IStaffState} from "types/state/staff";
import {
    STAFF_LOAD_START,
    STAFF_LOAD_FINISH,
    STAFF_DELETE_OK,
    STAFF_LOAD_SUCCESS,
    STAFF_ITEM_SUCCESS,
    STAFF_UPDATE_OBJECT,
    STAFF_CLEAR_ERROR,
    STAFF_SET_ERROR
} from "./actions/types";
import {nullUnit} from "../types/model/unit";

const initialState = (): IStaffState => ({
    staffs: [],
    staffItem: nullUnit,
    hasError: false,
    error: '',
    isLoading: false
});

export const staffReducer = (state: IStaffState = initialState(), action: any) => {

    switch (action.type) {
        case STAFF_LOAD_START:
            return {...state, isLoading: true};
        case STAFF_LOAD_FINISH:
            return {...state, isLoading: false};
        case STAFF_LOAD_SUCCESS:
            return {...state, staffs: action.items};
        case STAFF_ITEM_SUCCESS:
            return {...state, staffItem: action.item};
        case STAFF_UPDATE_OBJECT:
            return {...state, staffItem: action.item}
        case STAFF_DELETE_OK:
            return {...state, staffs: action.items};
        case STAFF_CLEAR_ERROR:
            return {...state, error: '', hasError: false};
        case STAFF_SET_ERROR:
            return {...state, error: action.error}
        default: return state;
    }
};
