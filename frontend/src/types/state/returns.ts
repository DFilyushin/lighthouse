import {IReturns, IReturnsList} from "../model/returns";


export interface IReturnsState {
    isLoading: boolean;
    returnItems: IReturnsList[];
    returnItem: IReturns;
}