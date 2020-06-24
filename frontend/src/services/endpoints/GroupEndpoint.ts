import BaseAPIEndpoint from "./BaseEndpoint";


class GroupEndpoint {

    /**
     * Получить список групп
     */
    static getGroupList(): string {
        return `${BaseAPIEndpoint.getBaseURL()}/group/`
    }
}

export default GroupEndpoint
