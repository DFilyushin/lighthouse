import { combineReducers } from "redux";
import {productReducer} from './productReducer'
import {IProductState} from "../types/state/product";
import {rawReducer} from "./rawReducer";
import {formulaReducer} from "./formulaReducer";
import {IRawState} from "../types/state/raw";
import {IFormulaState} from "../types/state/formula";
import {ITareState} from "../types/state/tare";
import {tareReducer} from "./tareReducer";

export interface IStateInterface {
    product: IProductState,
    raw: IRawState,
    formula: IFormulaState,
    tare: ITareState
}

export const rootReducer = combineReducers<IStateInterface>({
    product: productReducer,
    raw: rawReducer,
    formula: formulaReducer,
    tare: tareReducer

});
