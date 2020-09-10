import {IEmployeeListItem} from "./employee";

export interface IAccountListItem {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    joined: number;
    isAdmin: boolean;
}

export interface IUserGroup {
    name: string;
    description: string;
}

export interface IAccount {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    joined: string;
    lastLogin: string;
    groups: IUserGroup[];
    employee: IEmployeeListItem;
    isAdmin: boolean;
    password: string | null;
}


export const nullAccountItem: IAccount = {
    login: '',
    lastName: '',
    firstName: '',
    email: '',
    active: true,
    lastLogin: '',
    joined: '',
    groups: [],
    employee: {
        id: 0,
        tabNum: '',
        fio: '',
        staff: '',
        fired: ''
    },
    isAdmin: false,
    password: ''
};

/**
 * Профиль пользователя
 */
export interface IProfile {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    mail: string;
    ntfPassword: boolean;
    ntfCtlContract: boolean;
    ntfClaim: boolean;
    ntfPayment: boolean;
    groups: IUserGroup[];
}

export const nullProfile: IProfile = {
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mail: '',
    ntfClaim: false,
    ntfCtlContract: false,
    ntfPassword: false,
    ntfPayment: false,
    groups: []
}