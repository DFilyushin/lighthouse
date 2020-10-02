import {IProductionState} from "../types/state/production";
import {
    PROD_LOAD_START,
    PROD_LOAD_FINISH,
    PROD_LOAD_SUCCESS,
    PROD_LOAD_ITEM_SUCCESS,
    PROD_CHANGE_ITEM,
    PROD_TARE_LOAD_SUCCESS,
    PROD_TEAM_LOAD_SUCCESS,
    PROD_CALC_LOAD_SUCCESS,
    PROD_TEAM_CHANGE,
    PROD_CALC_CHANGE,
    PROD_TARE_CHANGE,
    PROD_CLEAR_ERROR,
    PROD_SET_ERROR,
    PROD_SAVE_OK,
    PROD_ADD_NEW_OK,
    PROD_ORIGIN_CALC_LOAD_SUCCESS,
    PROD_MATERIAL_LOAD_SUCCESS, PROD_MATERIAL_CHANGE
} from "./actions/types";
import {nullProduction} from "../types/model/production";


const initState = (): IProductionState => ({
    prodCardList: [],
    prodCardItem: {...nullProduction},
    prodCardTeam: [],
    prodCardCalc: [],
    prodCardTare: [],
    prodCardOriginalCalc: [],
    prodCardMaterial: [],
    hasError: false,
    typeMessage: '',
    error: '',
    isLoading: false,
    canRedirect: false
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
            return {...state, prodCardItem: action.item, canRedirect: false,
                prodCardCalc: [], prodCardList: [], prodCardTare: [], prodCardTeam: [], prodCardOriginalCalc: [], prodCardMaterial: []};
        case PROD_CHANGE_ITEM:
            return {...state, prodCardItem: action.item};
        case PROD_TEAM_LOAD_SUCCESS:
            return {...state, prodCardTeam: action.items};
        case PROD_CALC_LOAD_SUCCESS:
            return {...state, prodCardCalc: action.items};
        case PROD_TARE_LOAD_SUCCESS:
            return {...state, prodCardTare: action.items};
        case PROD_TEAM_CHANGE:
            return {...state, prodCardTeam: action.items};
        case PROD_MATERIAL_LOAD_SUCCESS:
            return {...state, prodCardMaterial: action.items};
        case PROD_MATERIAL_CHANGE:
            return {...state, prodCardMaterial: action.items};
        case PROD_CALC_CHANGE:
            return {...state, prodCardCalc: action.items};
        case PROD_TARE_CHANGE:
            return {...state, prodCardTare: action.items};
        case PROD_SET_ERROR:
            return {...state, error: action.error, hasError: true};
        case PROD_CLEAR_ERROR:
            return {...state, error: '', hasError: false};
        case PROD_SAVE_OK:
            return {...state, canRedirect: true};
        case PROD_ADD_NEW_OK:
            return {...state, prodCardItem: action.item}
        case PROD_ORIGIN_CALC_LOAD_SUCCESS:
            return {...state, prodCardOriginalCalc: action.items}
        default:
            return state;
    }
}
