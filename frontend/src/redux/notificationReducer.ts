import {INoticeState} from "types/state/notification";
import {
    NOTICE_LOAD_OK
} from "./actions/types";

const initState = (): INoticeState => ({
    notices: []
});

export const notificationReducer = (state = initState(), action: any) => {
    switch (action.type){
        case NOTICE_LOAD_OK:
            return {...state, notices: action.items}
        default:
            return state;
    }
}
