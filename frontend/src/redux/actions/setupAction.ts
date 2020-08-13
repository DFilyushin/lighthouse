import SetupEndpoint from "../../services/endpoints/SetupEndpoint";
import authAxios from "../../services/axios-api";
import {SETUP_FETCH_NDS_SUCCESS} from "./types";


/**
 * Получить ставку НДС
 */
export function getSetupNdsRate() {
    return async (dispatch: any, getState: any) => {
        const url = SetupEndpoint.getSetupFloatValue('NDS')
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
        const url = SetupEndpoint.getSetupFloatValue('NDS')
        try {
            const response = await authAxios.put(url, {'value': value})
        }catch (e) {

        }
    }
}

export function changeNdsValue(newValue: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchNdsSuccess(newValue))
    }
}

function fetchNdsSuccess(value: number) {
    return {
        type: SETUP_FETCH_NDS_SUCCESS,
        nds: value
    }
}