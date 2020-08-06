import {IOrganizationState} from "types/state/requsite";
import {
    ORG_LOAD_START,
    ORG_LOAD_FINISH,
    ORG_LOAD_SUCCESS, ORG_CHANGE_ITEM
} from "./actions/types";
import {nullOrganization} from "../types/model/org";

const initState = (): IOrganizationState => ({
    org: {...nullOrganization},
    error: '',
    hasError: false,
    isLoading: false
});

export const organizationReducer = (state = initState(), action: any) => {
    switch (action.type){
        case ORG_LOAD_START:
            return {...state, isLoading: true}
        case ORG_LOAD_FINISH:
            return {...state, isLoading: false}
        case ORG_LOAD_SUCCESS:
            return {...state, org: action.item}
        case ORG_CHANGE_ITEM:
            return {...state, org: action.item}
        default:
            return state;
    }
}
