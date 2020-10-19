import authAxios from "../../services/axios-api";
import MaterialEndpoint from "../../services/endpoints/MaterialEndpoint";
import {hideInfoMessage, showInfoMessage} from "./infoAction";
import {MATERIAL_LOAD_FINISH, MATERIAL_LOAD_START, MATERIAL_LOAD_SUCCESS} from "./types";
import {IMaterial} from "../../types/model/material";

/**
 * Получить название материала
 * @param materialId Код материала
 */
export async function getMaterialName(materialId: number) {
    const response = await authAxios.get(MaterialEndpoint.getMaterialItem(materialId))
    return Promise.resolve(response.data['name'])
}

/**
 * Получить список материалов
 */
export function loadMaterials() {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        try {
            const url = MaterialEndpoint.getMaterialList()
            const materialList: IMaterial[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                materialList.push(response.data[key])
            });
            dispatch(fetchSuccess(materialList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}


function fetchStart() {
    return {
        type: MATERIAL_LOAD_START
    }
}

function fetchFinish() {
    return {
        type: MATERIAL_LOAD_FINISH
    }
}

function fetchSuccess(items: IMaterial[]) {
    return {
        type: MATERIAL_LOAD_SUCCESS,
        items
    }
}
