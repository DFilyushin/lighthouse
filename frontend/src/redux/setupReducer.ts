import {ISetupState} from "../types/state/setup";
import {SETUP_FETCH_NDS_SUCCESS} from "./actions/types";

const initialState = (): ISetupState => ({
    nds: 0,
    mail: '',
    loaded: null
});


export const setupReducer = (state: ISetupState = initialState(), action: any) => {
    switch (action.type) {
        case SETUP_FETCH_NDS_SUCCESS:
            return {...state, nds: action.nds}
        default: return state;
    }
}