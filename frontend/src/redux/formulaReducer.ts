import { IFormulaState } from 'types/state/formula'
import {IFormulaItem} from "../types/model/formula";
import {
    PRODUCT_LOAD_ERROR,
    PRODUCT_LOAD_SUCCESS_ITEM,
    FORMULA_LOAD_SUCCESS,
    FORMULA_LOAD_START,
    FORMULA_LOAD_FINISH,
    FORMULA_ITEM_SUCCESS,
    FORMULA_UPDATE_OBJECT,
    FORMULA_SET_ERROR,
    FORMULA_DELETE_OK,
    FORMULA_GET_REFERENCE
}
    from
        "./actions/types";
import {nullProduct} from "../types/model/product";


const nullFormula: IFormulaItem = {
    id: 0,
    created: '',
    product: {...nullProduct},
    calcAmount: 0,
    calcLosses: 0,
    specification: '',
    density: 0,
    raws: []
}

const initialState = (): IFormulaState => ({
    formulas: [],
    formulaItem: {...nullFormula},
    formulasForSelect: [],
    isLoading: false,
    error: '',
    typeMessage: '',
    hasError: false
});

export const formulaReducer = (state = initialState(), action: any) => {
    switch (action.type) {
        case FORMULA_LOAD_SUCCESS:
            return {...state, formulas: action.items};
        case PRODUCT_LOAD_ERROR:
            return {...state, error: action.error, typeMessage: 'error', hasError: action.hasError};
        case FORMULA_LOAD_START:
            return {...state, isLoading: true};
        case FORMULA_LOAD_FINISH:
            return {...state, isLoading: false};
        case PRODUCT_LOAD_SUCCESS_ITEM:
            return {...state, productItem: action.productItem};
        case FORMULA_UPDATE_OBJECT:
            return {...state, formulaItem: action.item};
        case FORMULA_ITEM_SUCCESS:
            return {...state, formulaItem: action.item};
        case FORMULA_SET_ERROR:
            return {...state, error: action.error};
        case FORMULA_DELETE_OK:
            return {...state, formulas: action.items}
        case FORMULA_GET_REFERENCE:
            return {...state, formulasForSelect: action.items}
        default: return state
    }
};
