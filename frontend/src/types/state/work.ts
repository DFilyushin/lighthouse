import {IWork} from 'types/model/work'

export interface IWorkState {
    workItems: IWork[],
    workItem: IWork,
    isLoading: boolean,
    error: string,
    typeMessage: string,
    hasError: boolean,
    isOk: boolean
}
