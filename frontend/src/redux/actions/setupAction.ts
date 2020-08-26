import SetupEndpoint from "../../services/endpoints/SetupEndpoint";
import authAxios from "../../services/axios-api";
import {SETUP_FETCH_NDS_SUCCESS, SETUP_FETCH_RESERVE_INTERVAL} from "./types";
import {showInfoMessage} from "./infoAction";
import {SETUP_NDS, SETUP_RESERVE_INTERVAL} from "../../types/state/setup";


/**
 * Получить ставку НДС
 */
export function getSetupNdsRate() {
    return async (dispatch: any, getState: any) => {
        const url = SetupEndpoint.getSetupFloatValue(SETUP_NDS)
        const response = await authAxios.get(url)
        dispatch(fetchNdsSuccess(response.data['value']))
    }
}

/**
 * Обновить ставку НДС
 *
 */
export function updateSetupNdsRate() {
    return async (dispatch: any, getState: any) => {
        const value = getState().setup.nds
        const url = SetupEndpoint.getSetupFloatValue(SETUP_NDS)
        try {
            await authAxios.put(url, {'value': value})
        }catch (e) {
            const errMessage = `Не удалось обновить настройку "НДС"`
            dispatch(showInfoMessage('error', errMessage));
        }
    }
}

/**
 * Получить количество дней по-умолчанию для резерва продукции
 */
export function getSetupReserveInterval() {
    return async (dispatch: any, getState: any) => {
        try {
            const response = await authAxios.get(SetupEndpoint.getSetupIntegerValue(SETUP_RESERVE_INTERVAL))
            dispatch(fetchReserveInterval(response.data['value']))
        }catch (e) {
            const errMessage = `Не удалось получить настройку "Количество дней резерва продукции"`
            dispatch(showInfoMessage('error', errMessage));
        }
    }
}

/**
 * Обновить настройку дни по умолчанию для резерва продукции
 */
export function updateReserveInterval() {
    return async (dispatch: any, getState: any) => {
        const value = getState().setup.reserveInterval
        try {
            await authAxios.put(SetupEndpoint.getSetupIntegerValue(SETUP_RESERVE_INTERVAL), {'value': value})
        }catch (e) {
            const errMessage = `Не удалось обновить настройку "Количество дней резерва продукции"`
            dispatch(showInfoMessage('error', errMessage));
        }
    }
}


export function changeNdsValue(newValue: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchNdsSuccess(newValue))
    }
}

export function changeReserveInterval(newValue: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchReserveInterval(newValue))
    }
}

function fetchNdsSuccess(value: number) {
    return {
        type: SETUP_FETCH_NDS_SUCCESS,
        nds: value
    }
}

function fetchReserveInterval(value: number) {
    return{
        type: SETUP_FETCH_RESERVE_INTERVAL,
        interval: value
    }
}