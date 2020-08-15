export interface IPrice {
    id: number;
    productId: number;
    productName: string;
    date: string;
    price: number;
    tareId: number;
    tareName: string;
    tareV: number;
}

export const nullPrice: IPrice = {
    id: 0,
    productId: 0,
    productName: '',
    date: (new Date()).toISOString().slice(0, 10),
    price: 0,
    tareId: 0,
    tareName: '',
    tareV: 0
}