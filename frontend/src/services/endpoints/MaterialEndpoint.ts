import BaseAPIEndpoint from "./BaseEndpoint";


class MaterialEndpoint {

    /**
     * Получить материал по существующему коду
     * @param id - Код материала
     */
    static getMaterialItem(id: number): string {
        return `${BaseAPIEndpoint.getBaseURL()}/material/${id}/`
    }

}

export default MaterialEndpoint
