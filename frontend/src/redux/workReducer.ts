import {IWorkState} from "../types/state/work";
import {nullWork} from "../types/model/work";
import {
    WORK_DELETE_OK,
    WORK_LOAD_FINISH,
    WORK_LOAD_ITEM_SUCCESS,
    WORK_LOAD_START,
    WORK_LOAD_SUCCESS
} from "./actions/types";


const initState = (): IWorkState => ({
    workItems: [],
    workItem: {...nullWork},
    hasError: false,
    typeMessage: '',
    error: '',
    isLoading: false,
    isOk: false
});


export const workReducer = (state: IWorkState = initState(), action: any) => {
    switch (action.type) {
        case WORK_LOAD_START:
            return {...state, isLoading: true}
        case WORK_LOAD_FINISH:
            return {...state, isLoading: false}
        case WORK_LOAD_SUCCESS:
            return {...state, workItems: action.items}
        case WORK_LOAD_ITEM_SUCCESS:
            return {...state, workItem: action.item}
        case WORK_DELETE_OK:
            return {...state, workItems: action.items}
        default:
            return state;
    }
}
