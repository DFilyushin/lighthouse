import {
    ORG_LOAD_FINISH,
    ORG_LOAD_START,
    ORG_LOAD_SUCCESS,
    ORG_CHANGE_ITEM
} from "./types";
import {IOrganization} from "../../types/model/org";
import authAxios from "../../services/axios-api";
import {showInfoMessage} from "./infoAction";
import OrganizationEndpoint from "../../services/endpoints/OrgEndpoint";


/**
 * Загрузка данных
 */
export function loadOrganization() {
    return async (dispatch: any, getState: any) => {
        dispatch(loadOrgStart())
        try {
            const url = OrganizationEndpoint.getOrg()
            const response = await authAxios.get(url);
            const item: IOrganization = response.data
            dispatch(loadOrgSuccess(item))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }

        dispatch(loadOrgFinish())
    }
}

/**
 * Сохранение изменений
 * @param item Объект реквизитов
 */
export function saveOrganization(item: IOrganization) {
    return async (dispatch: any, getState: any) => {
        const url = OrganizationEndpoint.saveOrg();
        try{
            await authAxios.put(url, item)
            dispatch(showInfoMessage('info', 'Запись успешно сохранена'))
        }
        catch (e) {
            console.log(e.message)
            dispatch(showInfoMessage('error', `Не удалось сохранить запись ${e.toString()}!`))
        }
    }
}


export function changeOrganization(item: IOrganization) {
    return async (dispatch: any, getState: any) => {
        dispatch(changeOrgItem(item))
    }
}

function changeOrgItem(item: IOrganization) {
    return{
        type: ORG_CHANGE_ITEM,
        item
    }
}

function loadOrgStart() {
    return {
        type: ORG_LOAD_START
    }
}

function loadOrgFinish() {
    return{
        type: ORG_LOAD_FINISH
    }
}

function loadOrgSuccess(item: IOrganization) {
    return{
        type: ORG_LOAD_SUCCESS,
        item
    }
}