import authAxios from "../../services/axios-api";
import MaterialEndpoint from "../../services/endpoints/MaterialEndpoint";

/**
 * Получить название материала
 * @param materialId Код материала
 */
export async function getMaterialName(materialId: number) {
    const response = await authAxios.get(MaterialEndpoint.getMaterialItem(materialId))
    return Promise.resolve(response.data['name'])
}
