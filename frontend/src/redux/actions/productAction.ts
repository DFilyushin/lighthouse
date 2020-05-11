import axios from 'axios'
import ProductEndpoint from "services/endpoints/ProductEndpoint"
import {Product} from 'types/model/product'

import {
    PRODUCT_LOAD_FINISH,
    PRODUCT_LOAD_START,
    PRODUCT_LOAD_ERROR,
    PRODUCT_LOAD_SUCCESS,
    PRODUCT_LOAD_SUCCESS_ITEM,
    PRODUCT_UPDATE_OBJECT,
    PRODUCT_ADD_NEW,
    PRODUCT_DELETE_OK,
    PRODUCT_CLEAR_ERROR
} from './types'

const LS_KEY = 'products'

//FIXME При добавлении и удалении не обновляется результирующий стор
//FIXME Вынести управление ошибками и сообщениями в стор ошибок

/**
 * Загрузить список продукции
 * @param search поисковая строка
 * @param limit лимит вывода
 * @param offset сдвиг
 */
export function loadProduct(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchProductStart());
        const productInLocal = localStorage.getItem(LS_KEY);
        if (productInLocal){
            console.log('GetByStorage');
            const productList = JSON.parse(productInLocal);
            dispatch(productLoadSuccess(productList))

        }else {
            try {
                const url = ProductEndpoint.getProducts(search, limit, offset);
                console.log('GetByApi');
                const productList: Product[] = [];
                const response = await axios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    productList.push({
                        id: response.data[key]['id'],
                        name: response.data[key]['name'],
                    })
                });
                localStorage.setItem('products', JSON.stringify(productList))
                dispatch(productLoadSuccess(productList))
            } catch (e) {
                dispatch(productLoadError(e))
            }
        }
        dispatch(fetchProductFinish())
    }
}

/**
 * Загрузить один продукт в список
 * @param id Код продукта
 */
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

/**
 * Удалить продукт
 * @param id Код продукта
 */
export function deleteProduct(id: number) {
    return async (dispatch: any, getState: any) => {

        dispatch(fetchProductStart());
        try{
            const response = await axios.delete(ProductEndpoint.deleteProduct(id));
            if (response.status === 204) {
                const products = [...getState().product.products];
                const index = products.findIndex((elem, index, array)=>{return elem.id === id});
                products.splice(index, 1);
                dispatch(productDeleteOk(products));
                localStorage.removeItem(LS_KEY)
            }
            else {
                dispatch(productLoadError('Не удалось удалить продукт!'))
            }
        }catch (e) {
            console.log(e);
            dispatch(productLoadError('Не удалось удалить продукт!'))
        }
        dispatch(fetchProductFinish())
    }
}

/**
 * Изменение продукции в сторе
 * @param product
 */
export function changeProduct(product: Product) {
    return{
        type: PRODUCT_UPDATE_OBJECT,
        product
    }
}

/**
 * Обновление продукции
 * @param product Объект продукции
 */
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

/**
 * Добавить новый продукт
 * @param product Объект продукции
 */
export function addNewProduct(product: Product) {
    return async (dispatch: any, getState: any) => {
        console.log('addNewProduct', getState().product);
        dispatch(clearError());
        console.log('addNewProduct', getState().product);
        try{
            const response = await axios.post(ProductEndpoint.newProduct(), product);
            dispatch(productLoadItemSuccess(product))
        }catch (e) {
            dispatch(productLoadError('Не удалось добавить новый продукт!'))
        }
    }
}

export function clearError() {
    return{
        type: PRODUCT_CLEAR_ERROR
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
        error: error,
        hasError: true
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

function productDeleteOk(products: Product[]) {
    return{
        type: PRODUCT_DELETE_OK,
        products
    }
}
