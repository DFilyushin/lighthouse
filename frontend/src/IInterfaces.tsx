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