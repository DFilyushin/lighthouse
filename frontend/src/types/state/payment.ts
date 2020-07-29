import {IPaymentListItem, IPaymentItem} from 'types/model/payment'

export interface IPaymentState {
    paymentItems: IPaymentListItem[],
    paymentItem: IPaymentItem,
    isLoading: boolean,
    error: string,
    hasError: boolean
}