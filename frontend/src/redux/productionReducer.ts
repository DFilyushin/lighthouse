import {IProductionState} from "../types/state/production";
import {
    PROD_LOAD_START,
    PROD_LOAD_FINISH,
    PROD_LOAD_SUCCESS,
    PROD_LOAD_ITEM_SUCCESS,
    PROD_CHANGE_ITEM,
    PROD_TEAM_LOAD_SUCCESS,
    PROD_CALC_LOAD_SUCCESS,
    PROD_TEAM_CHANGE,
    PROD_CALC_CHANGE
} from "./actions/types";
import {nullProduction} from "../types/model/production";


const initState = (): IProductionState => ({
    prodCardList: [],
    prodCardItem: nullProduction,
    prodCardTeam: [],
    prodCardCalc: [],
    hasError: false,
    typeMessage: '',
    error: '',
    isLoading: false
});

export const productionReducer = (state = initState(), action: any) => {
    switch (action.type){
        case PROD_LOAD_START:
            return {...state, isLoading: true};
        case PROD_LOAD_FINISH:
            return {...state, isLoading: false};
        case PROD_LOAD_SUCCESS:
            return {...state, prodCardList: action.items};
        case PROD_LOAD_ITEM_SUCCESS:
            console.log('productionReducer', action.item);
            return {...state, prodCardItem: action.item};
        case PROD_CHANGE_ITEM:
            return {...state, prodCardItem: action.item};
        case PROD_TEAM_LOAD_SUCCESS:
            return {...state, prodCardTeam: action.items};
        case PROD_CALC_LOAD_SUCCESS:
            return {...state, prodCardCalc: action.items};
        case PROD_TEAM_CHANGE:
            return {...state, prodCardTeam: action.items};
        case PROD_CALC_CHANGE:
            return {...state, prodCardCalc: action.items};
        default:
            return state;
    }
}
