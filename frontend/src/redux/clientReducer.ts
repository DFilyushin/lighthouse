import {IClientState} from "../types/state/client";
import {nullClientItem} from "../types/model/client";
import {
    CLIENT_DELETE_OK,
    CLIENT_LOAD_CONTRACT_SUCCESS,
    CLIENT_LOAD_FINISH,
    CLIENT_LOAD_ITEM_SUCCESS,
    CLIENT_LOAD_START,
    CLIENT_LOAD_SUCCESS, CLIENT_SEARCH_SUCCESS
} from "./actions/types";

const getInitialState = () => ({
    items: [],
    clientItem: nullClientItem,
    contracts: [],
    searchClients: [],
    isLoading: false,
    error: '',
    hasError: false
});

export const clientReducer = (state: IClientState = getInitialState(), action:any) => {
    switch (action.type) {
        case CLIENT_LOAD_START: return {...state, isLoading: true};
        case CLIENT_LOAD_FINISH: return {...state, isLoading: false};
        case CLIENT_LOAD_SUCCESS: return {...state, items: action.items};
        case CLIENT_LOAD_ITEM_SUCCESS: return {...state, clientItem: action.item};
        case CLIENT_DELETE_OK: return {...state, items: action.items};
        case CLIENT_LOAD_CONTRACT_SUCCESS: return {...state, contracts: action.items};
        case CLIENT_SEARCH_SUCCESS: return {...state, searchClients: action.items};
        default: return state;
    }
}