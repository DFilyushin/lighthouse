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

export interface IClientItem {
    id: number,
    name: string,
    employee: string,
    agent: string,
    phone: string,
    email: string,
    fax: string,
    addr_reg: string,
    req_bin: string,
    req_account: string,
    req_bank: string,
    req_bik: string
    comment: string
    clientid: string
}
