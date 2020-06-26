import {IAccount, IAccountListItem, IUserGroup} from "../model/user";

export interface IUserState {
    groups: IUserGroup[];
    userItems: IAccountListItem[];
    userAccount: IAccount;
    isLoading: boolean;
    hasError: boolean;
    error: string;
}
