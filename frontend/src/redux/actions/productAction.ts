import ProductEndpoint from "services/endpoints/ProductEndpoint"
import {IProduct} from 'types/model/product'
import {
    PRODUCT_LOAD_FINISH,
    PRODUCT_LOAD_START,
    PRODUCT_LOAD_ERROR,
    PRODUCT_LOAD_SUCCESS,
    PRODUCT_LOAD_SUCCESS_ITEM,
    PRODUCT_UPDATE_OBJECT,
    PRODUCT_DELETE_OK,
    PRODUCT_CLEAR_ERROR
} from './types'
import {NEW_RECORD_VALUE} from "../../utils/AppConst";
import authAxios from "../../services/axios-api";
import {showInfoMessage} from "./infoAction";
import {capitalize} from "@material-ui/core";

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
            try {
                const url = ProductEndpoint.getProductList(search, limit, offset);
                const productList: IProduct[] = [];
                const response = await authAxios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    productList.push(response.data[key])
                });
                dispatch(productLoadSuccess(productList))
            } catch (e) {
                dispatch(productLoadError(e))
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
        let product: IProduct = {id: 0, name: ""};
        if (id === NEW_RECORD_VALUE){
            dispatch(productLoadItemSuccess(product))
        }else{
            dispatch(fetchProductStart());
            try {
                const response = await authAxios.get(ProductEndpoint.getProductItem(id));
                product.id = response.data['id'];
                product.name = response.data['name'];
                dispatch(productLoadItemSuccess(product))
            } catch (e) {
                dispatch(productLoadError(e))
            }
            dispatch(fetchProductFinish())
        }
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
            const response = await authAxios.delete(ProductEndpoint.deleteProduct(id));
            if (response.status === 204) {
                const products = [...getState().product.products];
                const index = products.findIndex((elem)=>{return elem.id === id});
                products.splice(index, 1);
                dispatch(productDeleteOk(products));
            }
            else {
                dispatch(productLoadError('Не удалось удалить продукт!'))
            }
        }catch (e) {
            dispatch(productLoadError('Не удалось удалить продукт!'))
        }
        dispatch(fetchProductFinish())
    }
}

/**
 * Изменение продукции в сторе
 * @param product
 */
export function changeProduct(product: IProduct) {
    return{
        type: PRODUCT_UPDATE_OBJECT,
        product
    }
}

/**
 * Обновление продукции
 * @param product Объект продукции
 */
export function updateProduct(product: IProduct){
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(ProductEndpoint.saveProduct(product.id), product);
        }catch (e) {
            console.log('Error save product record. Error message:', e.response)
            const  errorMessage = `Не удалось сохранить изменения по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

/**
 * Добавить новый продукт
 * @param product Объект продукции
 */
export function addNewProduct(product: IProduct) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const newProduct = {...product, name: capitalize(product.name)}
            const response = await authAxios.post(ProductEndpoint.newProduct(), newProduct);
            const items = [...getState().product.products]
            items.push(response.data)
            items.sort(function (a, b) {
                const nameA=a.name.toLowerCase()
                const nameB=b.name.toLowerCase()
                if (nameA < nameB) //сортируем строки по возрастанию
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 // Никакой сортировки
            })
            dispatch(productLoadSuccess(items))
        }catch (e) {
            console.log('Error add product record. Error message:', e.response)
            const  errorMessage = `Не удалось добавить новый продукт  по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
    }
}

export function clearError() {
    return{
        type: PRODUCT_CLEAR_ERROR
    }
}

function productLoadSuccess(products: IProduct[]) {
    return{
        type: PRODUCT_LOAD_SUCCESS,
        products
    }
}

function productLoadItemSuccess(productItem: IProduct) {
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

function productDeleteOk(products: IProduct[]) {
    return{
        type: PRODUCT_DELETE_OK,
        products
    }
}
