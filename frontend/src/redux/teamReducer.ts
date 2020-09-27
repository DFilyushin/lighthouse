import {ITeamState} from "../types/state/team";
import {TEAM_LOAD_FINISH, TEAM_LOAD_ITEM_SUCCESS, TEAM_LOAD_START, TEAM_LOAD_SUCCESS} from "./actions/types";

/**
 * Инит. состояние
 */
const initState = (): ITeamState => ({
    teamItems: [],
    teamItem: {
        id: 0,
        name: '',
        work: {
            id: 0,
            name: ''
        },
        members: []
    },
    hasError: false,
    typeMessage: '',
    error: '',
    isLoading: false
})

/**
 * Редьюсер управления состоянием шаблонов смен
 * @param state Состояние
 * @param action Действие
 */
export const teamReducer = (state: ITeamState = initState(), action: any) => {
    switch (action.type) {
        case TEAM_LOAD_START:
            return {...state, isLoading: true}
        case TEAM_LOAD_FINISH:
            return {...state, isLoading: false}
        case TEAM_LOAD_SUCCESS:
            return {...state, teamItems: action.items}
        case TEAM_LOAD_ITEM_SUCCESS:
            return {...state, teamItem: action.item}
        default:
            return state
    }
}
