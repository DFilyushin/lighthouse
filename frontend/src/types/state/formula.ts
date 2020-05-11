import {IFormula, IFormulaItem} from 'types/model/formula'

export interface IFormulaState {
    formulas: IFormula[],
    formulaItem: IFormulaItem,
    isLoading: boolean,
    error: string,
    typeMessage: string,
    hasError: boolean
}