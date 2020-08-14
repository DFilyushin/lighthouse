export interface IPrice {
    productId: number;
    productName: string;
    date: string;
    price: number;
    tareId: number;
    tareName: string;
    tareV: number;
}

export const nullPrice: IPrice = {
    productId: 0,
    productName: '',
    date: '',
    price: 0,
    tareId: 0,
    tareName: '',
    tareV: 0
}