import BaseAPIEndpoint from "./BaseEndpoint";

class ProductEndpoint {
    /**
     *
     * @param search - строка поиска
     * @param limit - количество записей в наборе
     * @param offset - сдвиг количества записей
     */
    static getProductList(search?: string, limit?: number, offset?: number): string {
        const baseUrl = `${BaseAPIEndpoint.getBaseURL()}/product/`;
        const url = new URL(baseUrl);
        if (search) url.searchParams.append('search', search);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        return url.href
    }

    /**
     * Получить продукцию по коду
     * @param id - код продукта
     */
    static getProductItem(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/product/${id}`
    }

    /**
     * Удалить имеющийся продукт по коду
     * @param id - код продукта
     */
    static deleteProduct(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/product/${id}/`
    }

    /**
     * Добавить новый продукт
     */
    static newProduct(): string{
        return `${BaseAPIEndpoint.getBaseURL()}/product/`
    }

    /**
     * Сохранить изменения в продукте
     * @param id - код продукта
     */
    static  saveProduct(id: number): string{
        return `${BaseAPIEndpoint.getBaseURL()}/product/${id}/`
    }
}

export default ProductEndpoint;