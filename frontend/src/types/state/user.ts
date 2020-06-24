import {IAccount, IAccountListItem} from "../model/user";

export interface IUserState {
    userItems: IAccountListItem[];
    userAccount: IAccount;
    isLoading: boolean;
    hasError: boolean;
    error: string;
}