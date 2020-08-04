import {IEmployeeListItem, nullEmployeeItem} from "./employee";

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
}


export const nullAccountItem: IAccount = {
    login: '',
    lastName: '',
    firstName: '',
    email: '',
    active: false,
    lastLogin: '',
    joined: '',
    groups: [],
    employee: {...nullEmployeeItem},
    isAdmin: false
};