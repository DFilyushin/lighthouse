import {IProduct} from 'types/model/product'

export interface IProductState {
    products: IProduct[],
    productItem: IProduct,
    isLoading: boolean,
    error: string,
    hasError: boolean
}