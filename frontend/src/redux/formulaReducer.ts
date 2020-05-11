import { IFormulaState } from 'types/state/formula'
import {IFormula, IFormulaItem} from "../types/model/formula";
import {
    PRODUCT_LOAD_START,
    PRODUCT_LOAD_ERROR,
    PRODUCT_LOAD_SUCCESS,
    PRODUCT_LOAD_FINISH,
    PRODUCT_LOAD_SUCCESS_ITEM,
    PRODUCT_UPDATE_OBJECT,
    PRODUCT_DELETE_OK,
    PRODUCT_CLEAR_ERROR, FORMULA_LOAD_SUCCESS, FORMULA_LOAD_START, FORMULA_LOAD_FINISH, FORMULA_ITEM_SUCCESS
}
    from
        "./actions/types";
import {nullProduct} from "../types/model/product";

const nullFormula: IFormulaItem = {
    id: 0,
    product: nullProduct,
    amount: 0,
    calcLosses: 0,
    specification: '',
    raws: []
}

const initialState = (): IFormulaState => ({
    formulas: [],
    formulaItem: nullFormula,
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
        case PRODUCT_UPDATE_OBJECT:
            return {...state, productItem: action.product};
        case PRODUCT_DELETE_OK:
            return {...state, products: action.products, typeMessage: 'success'};
        case PRODUCT_CLEAR_ERROR:
            return {...state, error: '', hasError: false, typeMessage: ''};
        case FORMULA_ITEM_SUCCESS:
            console.log('FORMULA_ITEM_SUCCESS', action.item)
            return {...state, formulaItem: action.item}
        default: return state
    }
};