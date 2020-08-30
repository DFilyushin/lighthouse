import { Color } from '@material-ui/lab/Alert';
import {
    INFO_SHOW_MESSAGE,
    INFO_HIDE_MESSAGE
} from "./types";

export function showInfoMessage(typeMessage: Color, textMessage: string) {
    return {
        type: INFO_SHOW_MESSAGE,
        messageType: typeMessage,
        messageText: textMessage
    }
}

export function hideInfoMessage() {
    return {
        type: INFO_HIDE_MESSAGE
    }
}