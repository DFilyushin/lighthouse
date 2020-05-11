import { combineReducers } from "redux";
import {productReducer} from './productReducer'
import {IProductState} from "../types/state/product";
import {rawReducer} from "./rawReducer";
import {formulaReducer} from "./formulaReducer";
import {IRawState} from "../types/state/raw";
import {IFormulaState} from "../types/state/formula";

export interface IStateInterface {
    product: IProductState,
    raw: IRawState,
    formula: IFormulaState
}

export const rootReducer = combineReducers<IStateInterface>({
    product: productReducer,
    raw: rawReducer,
    formula: formulaReducer

});
