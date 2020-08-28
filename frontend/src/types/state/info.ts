import { Color } from '@material-ui/lab/Alert';

export interface IInfoState {
    hasMessage: boolean,
    messageText: string,
    messageType: Color
}