import {ITare} from 'types/model/tare'

export interface ITareState {
    tareItems: ITare[],
    tareItem: ITare,
    isLoading: boolean,
    error: string,
    typeMessage: string,
    hasError: boolean,
    isOk: boolean
}
