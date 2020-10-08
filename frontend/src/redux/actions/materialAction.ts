import authAxios from "../../services/axios-api";
import ProductEndpoint from "../../services/endpoints/ProductEndpoint";


export async function getMaterialName(materialId: number) {
    let value: string = '';
    const response = await authAxios.get(ProductEndpoint.getProductItem(materialId))
    return Promise.resolve(response.data['name'])
}

export default getMaterialName
