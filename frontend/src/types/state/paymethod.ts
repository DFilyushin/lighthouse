import {IPayMethod} from 'types/model/paymethod'

export interface IPayMethodState {
    payMethodItems: IPayMethod[],
    payMethodItem: IPayMethod,
    isLoading: boolean,
    error: string,
    hasError: boolean
}