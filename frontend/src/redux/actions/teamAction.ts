import {hideInfoMessage, showInfoMessage} from "./infoAction";
import {TEAM_LOAD_FINISH, TEAM_LOAD_ITEM_SUCCESS, TEAM_LOAD_START, TEAM_LOAD_SUCCESS} from "./types";
import authAxios from "../../services/axios-api";
import TeamTemplateEndpoint from "../../services/endpoints/TeamTemplateEndpoint";
import {ITeamList, ITeam} from "../../types/model/team";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";


/**
 * Получить список шаблонов смен
 * @param search
 */
export function loadTeamTemplateList(search?: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        dispatch(hideInfoMessage())
        try {
            const url = TeamTemplateEndpoint.getTeamTemplateList(search)
            const teamList: ITeamList[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                teamList.push(response.data[key])
            });
            dispatch(fetchSuccess(teamList))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Получить смену по коду
 * @param id Код смены
 */
export function loadTeamItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        dispatch(hideInfoMessage())
        if (id === NEW_RECORD_VALUE) {
            const item: ITeam = {
                id: 0,
                name: '',
                work: {
                    id: 0,
                    name: ''
                },
                members: []
            }
            dispatch(fetchSuccessItem(item))
        } else {
            try {
                const url = TeamTemplateEndpoint.getTeamTemplate(id)
                const response = await authAxios.get(url)
                const item = response.data
                dispatch(fetchSuccessItem(item))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить существующий шаблон
 * @param id Код шаблона
 */
export function deleteTeam(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage())
        try {
            const url = TeamTemplateEndpoint.getTeamTemplate(id)
            const response = await authAxios.delete(url)
            if (response.status === 204) {
                const items = [...getState().team.teamItems];
                const index = items.findIndex((elem) => {
                    return elem.id === id
                });
                items.splice(index, 1);
                dispatch(fetchSuccess(items));
                dispatch(showInfoMessage('info', 'Запись успешно удалена'))
            } else {
                dispatch(showInfoMessage('error', `Неизвестная ошибка при удалении: ${response.status.toString()}`))
            }
        } catch (e) {
            dispatch(showInfoMessage('error', `Не удалось удалить запись ${e.toString()}!`))
        }
    }
}

/**
 * Обновить шаблон смен
 * @param item
 */
export function updateTeam(item: ITeam) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage())
        const url = TeamTemplateEndpoint.updateTeamTemplate(item.id)
        try {
            await authAxios.put(url, item)
        } catch (e) {
            dispatch(showInfoMessage('error', `Не удалось обновить запись ${e.toString()}!`))
            throw e
        }
    }
}

/**
 * Добавить новый шаблон смен
 * @param item
 */
export function newTeam(item: ITeam) {
    return async (dispatch: any, getState: any) => {
        dispatch(hideInfoMessage())
        try {
            const url = TeamTemplateEndpoint.newTeamTemplate()
            await authAxios.post(url, item)
        } catch (e) {
            dispatch(showInfoMessage('error', `Не удалось добавить запись ${e.toString()}!`))
            throw e
        }
    }
}

export function addNewMember() {
    return async (dispatch: any, getState: any) => {
        const teamItem: ITeam = {...getState().team.teamItem}
        teamItem.members.push(
            {
                id: 0,
                fio: '',
                fired: '',
                tabNum: '',
                staff: ""
            }
        )
        dispatch(fetchSuccessItem(teamItem))
    }
}

export function deleteMember(id: number) {
    return async (dispatch: any, getState: any) => {
        const teamItem: ITeam = {...getState().team.teamItem}
        const index = teamItem.members.findIndex((value => value.id === id))
        teamItem.members.splice(index, 1)
        dispatch(fetchSuccessItem(teamItem))
    }
}

export function changeTeamItem(item: ITeam) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchSuccessItem(item))
    }
}

function fetchStart() {
    return {
        type: TEAM_LOAD_START
    }
}

function fetchFinish() {
    return {
        type: TEAM_LOAD_FINISH
    }
}

function fetchSuccess(items: ITeamList[]) {
    return {
        type: TEAM_LOAD_SUCCESS,
        items
    }
}

function fetchSuccessItem(item: ITeam) {
    return {
        type: TEAM_LOAD_ITEM_SUCCESS,
        item
    }
}
