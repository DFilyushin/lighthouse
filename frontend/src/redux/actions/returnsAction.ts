import authAxios from "../../services/axios-api";
import {IReturnsList} from "../../types/model/returns";
import {RETURNS_LOAD_FINISH, RETURNS_LOAD_OK, RETURNS_LOAD_START} from "./types";
import {showInfoMessage} from "./infoAction";
import {ReturnsEndpoint} from "../../services/endpoints/ReturnsEndpoint";


/**
 * Загрузить список возвратов
 * @param startDate начальная дата
 * @param endDate окончание
 */
export function loadReturnsList(startDate: string, endDate: string) {
    return async (dispatch: any, getState: any) => {
        const itemList: IReturnsList[] = [];
        dispatch(fetchStart());
        try {
            const url = ReturnsEndpoint.getReturnList(startDate, endDate);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key) => {
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccess(itemList))
        } catch (e) {
            console.log('Error load list of returns product. Error message:', e.response)
            const errorMessage = `Не удалось загрузить список возвратов продукции по причине: ${e.response}`
            dispatch(showInfoMessage('error', errorMessage))
            throw e
        }
        dispatch(fetchFinish())
    }
}

function fetchStart() {
    return {
        type: RETURNS_LOAD_START
    }
}

function fetchFinish() {
    return {
        type: RETURNS_LOAD_FINISH
    }
}

function fetchSuccess(items: IReturnsList[]) {
    return {
        type: RETURNS_LOAD_OK,
        items
    }
}