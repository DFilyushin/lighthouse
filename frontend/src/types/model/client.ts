export interface IClientItemList {
    id: number,
    clientName: string,
    clientAddr: string,
    clientAgent: string,
    clientEmployee: string,
    clientBin: string
}
export const nullClientItemList: IClientItemList = {
    id: 0,
    clientName: '',
    clientAddr: '',
    clientEmployee: '',
    clientAgent: '',
    clientBin: ''
};


export interface IClientItem {
    id: number,
    created: string,
    clientName: string,
    clientAddr: string,
    clientAgent: string,
    clientEmployee: string,
    contactPhone: string,
    contactEmail: string,
    contactFax: string,
    reqBin: string,
    reqAccount: string,
    reqBank: string,
    reqBik: string,
    reqBoss: string,
    comment: string,
    clientId: string
}

export interface IClientSimple {
    id: number;
    clientName: string;
}

export const nullClientItem: IClientItem = {
    id: 0,
    created: '',
    clientName: '',
    clientAddr: '',
    clientAgent: '',
    clientEmployee: '',
    contactEmail: '',
    contactFax: '',
    contactPhone: '',
    clientId: '',
    reqAccount: '',
    reqBank: '',
    reqBik: '',
    reqBin: '',
    reqBoss: '',
    comment: ''
};