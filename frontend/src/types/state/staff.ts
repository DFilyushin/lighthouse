import {IStaff} from 'types/model/staff'

export interface IStaffState {
    staffs: IStaff[],
    staffItem: IStaff,
    isLoading: boolean,
    error: string,
    hasError: boolean
}