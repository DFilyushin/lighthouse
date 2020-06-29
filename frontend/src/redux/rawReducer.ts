import { IRawState } from 'types/state/raw'
import {IRaw} from "../types/model/raw";
import {
    RAW_CLEAR_ERROR,
    RAW_DELETE_OK,
    RAW_LOAD_ERROR,
    RAW_LOAD_FINISH,
    RAW_LOAD_START,
    RAW_LOAD_SUCCESS,
    RAW_LOAD_SUCCESS_ITEM,
    RAW_UPDATE_OBJECT
} from "./actions/types";


const nullRaw: IRaw = {
    id: 0,
    name: ''
}
const initialState = (): IRawState => ({
    raws: [],
    rawItem: nullRaw,
    isLoading: false,
    error: '',
    hasError: false
});


export const rawReducer = (state = initialState(), action: any) => {
    switch (action.type) {
        case RAW_LOAD_SUCCESS:
            return {...state, raws: action.items};
        case RAW_LOAD_ERROR:
            return {...state, error: action.error, typeMessage: 'error', hasError: action.hasError};
        case RAW_LOAD_START:
            return {...state, isLoading: true};
        case RAW_LOAD_FINISH:
            return {...state, isLoading: false};
        case RAW_LOAD_SUCCESS_ITEM:
            return {...state, rawItem: action.item};
        case RAW_UPDATE_OBJECT:
            return {...state, rawItem: action.item};
        case RAW_DELETE_OK:
            return {...state, raws: action.items, typeMessage: 'success'};
        case RAW_CLEAR_ERROR:
            return {...state, error: '', hasError: false, typeMessage: ''};
        default: return state
    }
};