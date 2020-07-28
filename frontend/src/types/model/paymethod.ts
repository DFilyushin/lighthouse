export interface IPayMethod {
    id: number;
    name: string;
}

export const nullPayMethod: IPayMethod = {
    id: 0,
    name: ''
}