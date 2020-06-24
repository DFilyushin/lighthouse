import {IEmployeeListItem} from "./employee";

export interface IAddress {
    country: string;
    state: string;
    city: string;
    street: string;
};

export interface IUserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    createdAt: number;
    address: IAddress;
};

export interface IAccountListItem {
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;
    joined: number;
}

export interface IUserGroup {
    name: string;
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
}