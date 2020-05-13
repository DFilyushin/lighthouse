import {IUnit} from 'types/model/unit'

export interface IUnitState {
    unitItems: IUnit[];
    unitItem: IUnit;
    isLoading: boolean;
    error: string;
    typeMessage: string;
    hasError: boolean;
}
