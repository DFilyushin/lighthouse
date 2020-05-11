import {Raw} from 'types/model/raw'

export interface IRawState {
    raws: Raw[],
    rawItem: Raw,
    isLoading: boolean,
    error: string,
    typeMessage: string,
    hasError: boolean
}