import {ICostState, nullCost} from "../types/state/cost";
import {
    COST_CHANGE_ITEM, COST_CLEAR_ERROR,
    COST_LOAD_FINISH, COST_LOAD_FLAT_SUCCESS,
    COST_LOAD_ITEM_SUCCESS,
    COST_LOAD_PARENT_ITEMS,
    COST_LOAD_START,
    COST_LOAD_SUCCESS, COST_SET_ERROR
} from "./actions/types";

const getInitialState= (): ICostState => ({
    items: [],
    costItem: nullCost,
    costFlatItems: [],
    error: '',
    hasError: false,
    isLoading: false,
    parentItems: []
})

export const costReducer = (state: ICostState = getInitialState(), action:any) => {
    switch (action.type) {
        case COST_LOAD_START:
            return {...state, isLoading: true};
        case COST_LOAD_FINISH:
            return {...state, isLoading: false};
        case COST_LOAD_SUCCESS:
            return {...state, items: action.items};
        case COST_LOAD_ITEM_SUCCESS:
            return {...state, costItem: action.item}
        case COST_LOAD_PARENT_ITEMS:
            return {...state, parentItems: action.items}
        case COST_CHANGE_ITEM:
            return {...state, costItem: action.item}
        case COST_SET_ERROR:
            return {...state, error: action.error, hasError: true}
        case COST_CLEAR_ERROR:
            return {...state, error: '', hasError: false}
        case COST_LOAD_FLAT_SUCCESS:
            return {...state, costFlatItems: action.items}
        default:
            return state;
    }
}