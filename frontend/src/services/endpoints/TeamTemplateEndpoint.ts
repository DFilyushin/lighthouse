import BaseAPIEndpoint from "./BaseEndpoint";


class TeamTemplateEndpoint {

    /**
     * Получить список шаблонов смен
     * @param search Поисковая строка
     */
    static getTeamTemplateList(search?: string): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/team/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        return url.href
    }


    /**
     * Получить шаблон по существующему коду
     * @param id Код шаблона
     */
    static getTeamTemplate(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/team/${id}/`
    }

    /**
     * Удалить существующий шаблон
     * @param id Код шаблона
     */
    static deleteTeamTemplate(id: number): string {
        return this.getTeamTemplate(id)
    }


    /**
     * Обновить шаблон
     * @param id Код шаблона
     */
    static updateTeamTemplate(id: number): string {
        return this.getTeamTemplate(id)
    }

    
    /**
     * Новый шаблон смены
     */
    static newTeamTemplate(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/team/`
    }
}

export default TeamTemplateEndpoint
