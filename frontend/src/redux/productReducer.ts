import { IProductState } from 'types/state/product'
import {
    PRODUCT_LOAD_START,
    PRODUCT_LOAD_ERROR,
    PRODUCT_LOAD_SUCCESS,
    PRODUCT_LOAD_FINISH,
    PRODUCT_LOAD_SUCCESS_ITEM,
    PRODUCT_UPDATE_OBJECT,
    PRODUCT_DELETE_OK,
    PRODUCT_CLEAR_ERROR
}
    from
        "./actions/types";
import {IProduct} from "../types/model/product";

const nullProduct: IProduct = {
    id: 0,
    name: ''
}

const initialState = (): IProductState => ({
    products: [],
    productItem: nullProduct,
    isLoading: false,
    error: '',
    hasError: false
});

export const productReducer = (state = initialState(), action: any) => {
    switch (action.type) {
        case PRODUCT_LOAD_SUCCESS:
            return {...state, products: action.products};
        case PRODUCT_LOAD_ERROR:
            return {...state, error: action.error, typeMessage: 'error', hasError: action.hasError};
        case PRODUCT_LOAD_START:
            return {...state, isLoading: true};
        case PRODUCT_LOAD_FINISH:
            return {...state, isLoading: false};
        case PRODUCT_LOAD_SUCCESS_ITEM:
            return {...state, productItem: action.productItem};
        case PRODUCT_UPDATE_OBJECT:
            return {...state, productItem: action.product};
        case PRODUCT_DELETE_OK:
            return {...state, products: action.products, typeMessage: 'success'};
        case PRODUCT_CLEAR_ERROR:
            return {...state, error: '', hasError: false, typeMessage: ''};
        default: return state
    }
};