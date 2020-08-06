import { combineReducers } from "redux"

import {IUnitState} from "../types/state/unit"
import {IProductState} from "../types/state/product"
import {IRawState} from "../types/state/raw"
import {ITareState} from "../types/state/tare"
import {IInfoState} from "../types/state/info"
import {IFormulaState} from "../types/state/formula"
import {IStaffState} from "../types/state/staff"
import {IProductionState} from "../types/state/production"
import {IFactoryLineState} from "../types/state/factorylines"
import {IContractState} from "../types/state/contract"
import {IEmployeeState} from "../types/state/employee"
import {IDepartmentState} from "../types/state/department"
import {IClientState} from "../types/state/client"
import {ICostState} from "../types/state/cost"
import {IStoreState} from "../types/state/store"
import {IExpenseState} from "../types/state/expense"
import {IUserState} from "../types/state/user"
import {IPaymentState} from "../types/state/payment"
import {IWorkState} from "../types/state/work"
import {IPayMethodState} from "../types/state/paymethod"

import {productReducer} from './productReducer'
import {rawReducer} from "./rawReducer"
import {formulaReducer} from "./formulaReducer"
import {tareReducer} from "./tareReducer"
import {infoReducer} from "./infoReducer"
import {unitReducer} from "./unitReducer"
import {staffReducer} from "./staffReducer"
import {productionReducer} from "./productionReducer"
import {factoryLineReducer} from "./factoryLineReducer"
import {employeeReducer} from "./employeeReducer"
import {departmentReducer} from "./departmentReducer"
import {clientReducer} from "./clientReducer"
import {contractReducer} from './contractReducer'
import {costReducer} from "./costReducer"
import {storeReducer} from "./storeReducer"
import {expenseReducer} from "./expenseReducer"
import {userReducer} from "./userReducer"
import {workReducer} from "./workReducer"
import {payMethodReducer} from "./payMethodReducer"
import {paymentReducer} from "./paymentReducer"
import {IOrganizationState} from "../types/state/requsite";
import {organizationReducer} from "./organizationReducer";

export interface IStateInterface {
    product: IProductState;
    raw: IRawState;
    formula: IFormulaState;
    tare: ITareState;
    info: IInfoState;
    unit: IUnitState;
    staff: IStaffState;
    production: IProductionState;
    factoryLine: IFactoryLineState;
    employee: IEmployeeState;
    department: IDepartmentState;
    client: IClientState;
    contract: IContractState;
    cost: ICostState;
    store: IStoreState;
    expense: IExpenseState;
    user: IUserState;
    works: IWorkState;
    payMethod: IPayMethodState;
    payment: IPaymentState;
    org: IOrganizationState;
}

export const rootReducer = combineReducers<IStateInterface>({
    product: productReducer,
    raw: rawReducer,
    formula: formulaReducer,
    tare: tareReducer,
    info: infoReducer,
    unit: unitReducer,
    staff: staffReducer,
    production: productionReducer,
    factoryLine: factoryLineReducer,
    employee: employeeReducer,
    department: departmentReducer,
    client: clientReducer,
    contract: contractReducer,
    cost: costReducer,
    store: storeReducer,
    expense: expenseReducer,
    user: userReducer,
    works: workReducer,
    payMethod: payMethodReducer,
    payment: paymentReducer,
    org: organizationReducer
})
