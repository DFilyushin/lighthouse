import { combineReducers } from "redux";
import {productReducer} from './productReducer'
import {IProductState} from "../types/state/product";

export interface StateInterface {
    product: IProductState;
}

export const rootReducer = combineReducers({
    product: productReducer
});
