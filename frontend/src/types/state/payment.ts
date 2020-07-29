import {IPaymentListItem, IPaymentItem} from 'types/model/payment'

export interface IPayMethodState {
    paymentItems: IPaymentListItem[],
    paymentItem: IPaymentItem,
    isLoading: boolean,
    error: string,
    hasError: boolean
}