import {hideInfoMessage, showInfoMessage} from "./infoAction";
import FormulaEndpoint from "../../services/endpoints/FormulaEndpoint";
import {IFormula} from "../../types/model/formula";
import authAxios from "../../services/axios-api";
import moment from "moment";
import {PRICE_LOAD_FINISH, PRICE_LOAD_START, PRICE_LOAD_SUCCESS} from "./types";
import {IPrice} from "../../types/model/price";
import PriceEndpoint from "../../services/endpoints/PriceEndpoint";


/**
 * Загрузить актуальный прайс-лист
 */
export function loadActualPriceList() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        try {
            const url = PriceEndpoint.loadPriceList();
            const priceList: IPrice[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                priceList.push(response.data[key])
            });
            dispatch(fetchSuccess(priceList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

function fetchStart() {
    return{
        type: PRICE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: PRICE_LOAD_FINISH
    }
}

function fetchSuccess(items: IPrice[]) {
    return{
        type: PRICE_LOAD_SUCCESS,
        items
    }
}