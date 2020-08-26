import {ISetupState} from "../types/state/setup";
import {
    SETUP_FETCH_NDS_SUCCESS,
    SETUP_FETCH_RESERVE_INTERVAL
} from "./actions/types";

const initialState = (): ISetupState => ({
    nds: 0,
    reserveInterval: 0,
    loaded: null
})


export const setupReducer = (state: ISetupState = initialState(), action: any) => {
    switch (action.type) {
        case SETUP_FETCH_NDS_SUCCESS:
            return {...state, nds: action.nds}
        case SETUP_FETCH_RESERVE_INTERVAL:
            return {...state, reserveInterval: action.interval}
        default: return state;
    }
}