import {ITeamList, ITeam} from 'types/model/team'

export interface ITeamState {
    teamItems: ITeamList[];
    teamItem: ITeam;
    isLoading: boolean;
    error: string;
    typeMessage: string;
    hasError: boolean;
}
