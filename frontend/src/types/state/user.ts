import {IAccount, IAccountListItem, IProfile, IUserGroup} from "../model/user";

export interface IUserState {
    groups: IUserGroup[];
    userItems: IAccountListItem[];
    userAccount: IAccount;
    userProfile: IProfile;
    isLoading: boolean;
    hasError: boolean;
    error: string;
    userNotFound: boolean;
}
