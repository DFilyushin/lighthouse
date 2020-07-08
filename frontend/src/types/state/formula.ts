import {IFormula, IFormulaItem, IFormulaSelectedItem} from 'types/model/formula'

export interface IFormulaState {
    formulas: IFormula[];
    formulaItem: IFormulaItem;
    formulasForSelect: IFormulaSelectedItem[];
    isLoading: boolean;
    error: string;
    typeMessage: string;
    hasError: boolean;
}
