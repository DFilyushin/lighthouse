import {Staff} from 'types/model/staff'

export interface IStaffState {
    staffs: Staff[],
    staffItem: Staff,
    isLoading: boolean,
    error: string,
    hasError: boolean
}