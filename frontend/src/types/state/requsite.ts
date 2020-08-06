import {IOrganization} from "../model/org";

export interface IOrganizationState {
    org: IOrganization,
    isLoading: boolean,
    error: string,
    hasError: boolean
}