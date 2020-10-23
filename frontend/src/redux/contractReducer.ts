import {IContractState} from "../types/state/contract";
import {
    CONTRACT_DELETE_OK,
    CONTRACT_LOAD_START,
    CONTRACT_LOAD_FINISH,
    CONTRACT_LOAD_ITEM_SUCCESS,
    CONTRACT_LOAD_SUCCESS,
    CONTRACT_CHANGE_ITEM,
    CONTRACT_SET_ERROR,
    CONTRACT_CLEAR_ERROR,
    CONTRACT_LOAD_ACTIVE_CONTRACTS,
    CONTRACT_SHOW_OWN_CONTRACT_STATE,
    CONTRACT_SET_NOT_FOUND
} from "./actions/types";
import {nullContractItem} from "../types/model/contract";

const getInitialState = () => ({
    contractItems: [],
    contractItem: nullContractItem,
    activeContracts: [],
    isLoading: false,
    error: '',
    hasError: false,
    showOwnContract: true,
    contractNotFound: false
});

export const contractReducer = (state: IContractState = getInitialState(), action: any) => {
    switch (action.type) {
        case CONTRACT_LOAD_START:
            return {...state, isLoading: true}
        case CONTRACT_LOAD_FINISH:
            return {...state, isLoading: false}
        case CONTRACT_LOAD_SUCCESS:
            return {...state, contractItems: action.items}
        case CONTRACT_LOAD_ITEM_SUCCESS:
            return {...state, contractItem: action.item}
        case CONTRACT_DELETE_OK:
            return {...state, contractItems: action.items}
        case CONTRACT_CHANGE_ITEM:
            return {...state, contractItem: action.item}
        case CONTRACT_SET_ERROR:
            return {...state, error: action.error, hasError: true}
        case CONTRACT_CLEAR_ERROR:
            return {...state, error: '', hasError: false}
        case CONTRACT_LOAD_ACTIVE_CONTRACTS:
            return {...state, activeContracts: action.items}
        case CONTRACT_SHOW_OWN_CONTRACT_STATE:
            return {...state, showOwnContract: action.value}
        case CONTRACT_SET_NOT_FOUND:
            return {...state, contractNotFound: action.value}
        default:
            return state;
    }
};
