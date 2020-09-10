import {IReturnsState} from "../types/state/returns";
import {nullReturnItem} from "../types/model/returns";
import {RETURNS_LOAD_FINISH, RETURNS_LOAD_OK, RETURNS_LOAD_START} from "./actions/types";

const initialState = (): IReturnsState => ({
    returnItems: [],
    returnItem: nullReturnItem,
    isLoading: false
})

export const returnsReducer = (state = initialState(), action: any) => {
    switch (action.type) {
        case RETURNS_LOAD_START:
            return {...state, isLoading: true}
        case RETURNS_LOAD_FINISH:
            return {...state, isLoading: false}
        case RETURNS_LOAD_OK:
            return {...state, returnItems: action.items}
        default: return state;
    }
}