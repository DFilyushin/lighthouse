export interface IStoreBase {
    id: number;
    name: string;
    tare: string;
    v: number;
    unit: string;
    total: number;
}

export interface IStoreRaw extends IStoreBase{}

export interface IStoreProduct extends IStoreBase{}
