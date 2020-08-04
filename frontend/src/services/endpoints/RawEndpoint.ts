import BaseAPIEndpoint from "./BaseEndpoint";


class RawEndpoint{

    static getRawList(search?: string, limit?: number, offset?: number){
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/raw/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    static getRawItem(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/raw/${id}/`
    }

    static deleteRaw(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/raw/${id}/`
    }

    static newRaw(){
        return `${BaseAPIEndpoint.getBaseURL()}/raw/`
    }

    static saveRaw(id: number){
        return `${BaseAPIEndpoint.getBaseURL()}/raw/${id}/`
    }
}

export default RawEndpoint;