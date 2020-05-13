import { combineReducers } from "redux";

import {IUnitState} from "../types/state/unit";
import {IProductState} from "../types/state/product";
import {IRawState} from "../types/state/raw";
import {ITareState} from "../types/state/tare";
import {IInfoState} from "../types/state/info";
import {IFormulaState} from "../types/state/formula";
import {IStaffState} from "../types/state/staff";

import {productReducer} from './productReducer'
import {rawReducer} from "./rawReducer";
import {formulaReducer} from "./formulaReducer";
import {tareReducer} from "./tareReducer";
import {infoReducer} from "./infoReducer";
import {unitReducer} from "./unitReducer";
import {staffReducer} from "./staffReducer";


export interface IStateInterface {
    product: IProductState;
    raw: IRawState;
    formula: IFormulaState;
    tare: ITareState;
    info: IInfoState;
    unit: IUnitState;
    staff: IStaffState;
}

export const rootReducer = combineReducers<IStateInterface>({
    product: productReducer,
    raw: rawReducer,
    formula: formulaReducer,
    tare: tareReducer,
    info: infoReducer,
    unit: unitReducer,
    staff: staffReducer
});
