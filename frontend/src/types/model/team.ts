import {IEmployeeListItem} from "./employee";
import {IWork} from "./work";

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
     * Вид работ
     */
    work: IWork;
    /**
     * Список сотрудников
     */
    members: IEmployeeListItem[];
}
