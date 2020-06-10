import {IContractState} from "../types/state/contract";
import {
    CONTRACT_DELETE_OK,
    CONTRACT_LOAD_START,
    CONTRACT_LOAD_FINISH,
    CONTRACT_LOAD_ITEM_SUCCESS,
    CONTRACT_LOAD_SUCCESS, CONTRACT_CHANGE_ITEM
} from "./actions/types";
import {nullContractItem} from "../types/model/contract";

const getInitialState = () => ({
    items: [],
    contractItem: nullContractItem,
    isLoading: false,
    error: '',
    hasError: false
});

export const contractReducer = (state: IContractState = getInitialState(), action:any) => {
    switch (action.type) {
        case CONTRACT_LOAD_START: return {...state, isLoading: true};
        case CONTRACT_LOAD_FINISH: return {...state, isLoading: false};
        case CONTRACT_LOAD_SUCCESS: return {...state, items: action.items};
        case CONTRACT_LOAD_ITEM_SUCCESS: return {...state, contractItem: action.item};
        case CONTRACT_DELETE_OK: return {...state, items: action.items};
        case CONTRACT_CHANGE_ITEM: return {...state, contractItem: action.item};
        default: return state;
    }
};