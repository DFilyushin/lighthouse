import {IInfoState} from "types/state/info";
import {
    INFO_SHOW_MESSAGE,
    INFO_HIDE_MESSAGE
} from "./actions/types";

const initState = (): IInfoState => ({
    hasMessage: false,
    messageText: '',
    messageType: "info"
});

export const infoReducer = (state = initState(), action: any) => {
    switch (action.type){
        case INFO_SHOW_MESSAGE:
            return {...state, messageType: action.messageType, messageText: action.messageText, hasMessage: true}
        case INFO_HIDE_MESSAGE:
            return {...state, messageType: '', messageText: '', hasMessage: false}
        default:
            return state;
    }
}
