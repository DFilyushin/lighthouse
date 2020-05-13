interface IEndpointInterface {
    getItemList(search?: string, limit?: number, offset?: number): string;
    getItem(id: number): string;
    deleteItem(id: number): string;
    updateItem(id: number): string;
    newItem(): string;
}
export default IEndpointInterface;