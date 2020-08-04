import BaseAPIEndpoint from './BaseEndpoint'

class OrganizationEndpoint {

    /**
     * Реквизиты организации
     */
    static getOrg() {
        return `${BaseAPIEndpoint.getBaseURL()}/org/`
    }

    /**
     * Сохранить реквизиты организации
     */
    static saveOrg(){
        return `${BaseAPIEndpoint.getBaseURL()}/org/`
    }
}

export default OrganizationEndpoint;
