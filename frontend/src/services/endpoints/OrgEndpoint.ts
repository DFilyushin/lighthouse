import BaseAPIEndpoint from './BaseEndpoint'

class OrganizationEndpoint {

    /**
     * Реквизиты организации
     */
    static getOrg() {
        const baseUrl = BaseAPIEndpoint.getBaseURL();
        return `${baseUrl}/org`
    }

    /**
     * Сохранить реквизиты организации
     */
    static putOrg(){
        const baseUrl = BaseAPIEndpoint.getBaseURL();
        return `${baseUrl}/org/`
    }
}

export default OrganizationEndpoint;
