import {IMaterialState} from "../types/state/material";
import {MATERIAL_LOAD_FINISH, MATERIAL_LOAD_START, MATERIAL_LOAD_SUCCESS} from "./actions/types";

const initialState = (): IMaterialState => ({
    materialItems: [],
    isLoading: false
})

export const materialReducer = (state: IMaterialState = initialState(), action: any) => {
    switch (action.type) {
        case MATERIAL_LOAD_START:
            return {...state, isLoading: true}
        case MATERIAL_LOAD_FINISH:
            return {...state, isLoading: false}
        case MATERIAL_LOAD_SUCCESS:
            return {...state, materialItems: action.items}
        default: return state;
    }
}
