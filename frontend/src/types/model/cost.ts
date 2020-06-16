
export interface ICost {
    id: number;
    name: string;
    childs: ICost[];
    parent: number;
}

export interface ICostSimple {
    id: number;
    name: string;
}