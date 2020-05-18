import { nullUnit } from "../types/model/unit";
import { IUnitState } from "types/state/unit";
import {
    UNIT_LOAD_START,
    UNIT_LOAD_FINISH,
    UNIT_DELETE_OK,
    UNIT_LOAD_SUCCESS,
    UNIT_ITEM_SUCCESS,
    UNIT_UPDATE_OBJECT,
    UNIT_CLEAR_ERROR,
    UNIT_SET_ERROR
} from "./actions/types";

const initState = (): IUnitState => ({
    unitItems: [],
    unitItem: nullUnit,
    hasError: false,
    typeMessage: '',
    error: '',
    isLoading: false
});


export const unitReducer = (state: IUnitState = initState(), action: any) => {

    switch (action.type) {
        case UNIT_LOAD_START:
            return {...state, isLoading: true};
        case UNIT_LOAD_FINISH:
            return {...state, isLoading: false};
        case UNIT_LOAD_SUCCESS:
            return {...state, unitItems: action.items};
        case UNIT_ITEM_SUCCESS:
            return {...state, unitItem: action.item};
        case UNIT_UPDATE_OBJECT:
            return {...state, unitItem: action.item}
        case UNIT_DELETE_OK:
            return {...state, unitItems: action.items};
        case UNIT_CLEAR_ERROR:
            return {...state, error: '', hasError: false};
        case UNIT_SET_ERROR:
            return {...state, error: action.error, hasError: true};
        default: return state;
    }
};
