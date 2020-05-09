export interface IAddress {
    country: string,
    state: string,
    city: string,
    street: string
};

export interface IUserData {
    id: string,
    name: string,
    email: string,
    phone: string,
    avatarUrl: string,
    createdAt: number,
    address: IAddress
};

export interface IEmployeeTableItem {
    id: number,
    fio: string,
    dob: string,
    tab_num: string,
    staff: string
};

export interface IProductTableItem {
    id: number,
    name: string
}

export interface IClientItemList {
    id: number,
    clientName: string,
    clientAddr: string,
    clientAgent: string,
    clientEmployee: string
}

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
    reqBik: string
    comment: string
    clientId: string
}

export interface IContractListItem {
    id: number,
    clientName: string,
    contractNum: string,
    totalSum: number,
    contractDate: string,
    deliveryDate: string
}

export interface IContract {
    id: number,
    created: string,
    clientName: string,
    contractNum: string,
    contractDate: string,
    deliveryDate: string,
    state: number,
    delivered: string,
    discount: number,
    comment: string,
}

export interface IOrganization {
    name: string,
    addrReg: string,
    contactEmail: string,
    contactPhone: string,
    contactFax: string,
    reqBank: string,
    reqBin: string,
    reqAccount: string,
    reqBik: string,
    bossName: string

}