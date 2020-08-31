import {IFactoryLine} from 'types/model/factorylines'

export interface IFactoryLineState {
    lineItems: IFactoryLine[],
    lineItem: IFactoryLine,
    isLoading: boolean,
    error: string,
    typeMessage: string,
    hasError: boolean
}