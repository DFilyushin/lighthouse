import {IRaw} from 'types/model/raw'

export interface IRawState {
    raws: IRaw[],
    rawItem: IRaw,
    isLoading: boolean,
    error: string,
    hasError: boolean
}