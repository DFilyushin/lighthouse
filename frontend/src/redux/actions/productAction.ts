import axios from 'axios'
import ProductEndpoint from "services/endpoints/ProductEndpoint";
import {Product} from 'types/model/product'

import {
    PRODUCT_LOAD_FINISH,
    PRODUCT_LOAD_START,
    PRODUCT_LOAD_ERROR,
    PRODUCT_LOAD_SUCCESS,
    PRODUCT_LOAD_SUCCESS_ITEM,
    PRODUCT_UPDATE_OBJECT, PRODUCT_ADD_NEW
} from './types';


export function loadProduct(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        const productList: Product[] = [];
        dispatch(fetchProductStart());
        try{
            const response = await axios.get(ProductEndpoint.getProducts(search, limit, offset));
            Object.keys(response.data).forEach((key, index)=>{
                productList.push({
                    id: response.data[key]['id'],
                    name: response.data[key]['name'],
                })
            });
            dispatch(productLoadSuccess(productList))
        }catch (e) {
            dispatch(productLoadError(e))
        }
        dispatch(fetchProductFinish())
    }
}

export function loadProductItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let product: Product = {id: 0, name: ""};
        dispatch(fetchProductStart());
        try{
            const response = await axios.get(ProductEndpoint.getProduct(id));
            console.log(response.data);
            product.id = response.data['id'];
            product.name = response.data['name'];
            dispatch(productLoadItemSuccess(product))
        }catch (e) {
            dispatch(productLoadError(e))
        }
        dispatch(fetchProductFinish())
    }
}

export function changeProduct(product: Product) {
    return{
        type: PRODUCT_UPDATE_OBJECT,
        product
    }
}

export function updateProduct(product: Product){
    return async (dispatch: any, getState: any) => {
        try{
            const response = await axios.put(ProductEndpoint.saveProduct(product.id), product);
            console.log(response.data);
        }catch (e) {
            dispatch(productLoadError(e))
        }
    }
}

export function addNewProduct(product: Product) {
    return{
        type: PRODUCT_ADD_NEW,
        product
    }
}

function productLoadSuccess(products: Product[]) {
    return{
        type: PRODUCT_LOAD_SUCCESS,
        products
    }
}

function productLoadItemSuccess(productItem: Product) {
    return{
        type: PRODUCT_LOAD_SUCCESS_ITEM,
        productItem
    }
}

function productLoadError(error: string) {
    return{
        type: PRODUCT_LOAD_ERROR,
        error
    }
}

function fetchProductStart() {
    return {
        type: PRODUCT_LOAD_START
    }
}


function fetchProductFinish() {
    return{
        type: PRODUCT_LOAD_FINISH
    }
}