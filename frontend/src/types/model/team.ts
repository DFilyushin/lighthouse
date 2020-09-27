import {IEmployeeListItem} from "./employee";

export interface ITeamList {
    /**
     * Код шаблона смены
     */
    id: number;
    /**
     * Наименование
     */
    name: string;
}

export interface ITeam {
    /**
     * Код шаблона смены
     */
    id: number;
    /**
     * Наименование
     */
    name: string;
    /**
     * Список сотрудников
     */
    members: IEmployeeListItem[];
}
