import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {useDispatch, useSelector} from "react-redux"
import { useHistory } from "react-router-dom"
import CircularIndeterminate from "components/Loader/Loader"
import {
    PAYMENT_METHOD,
    PAYMENT_PERIOD_END,
    PAYMENT_PERIOD_START
} from "types/Settings"
import {IStateInterface} from "redux/rootReducer"
import {deletePayment, loadPaymentList} from "redux/actions/paymentAction"
import PaymentToolbar from "../components/PaymentToolbar"
import PaymentTable from "../components/PaymentTable"
import {loadPayMethodItems} from "redux/actions/payMethodAction"
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "utils/AppConst"
import {useConfirm} from "material-ui-confirm"

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}))

const PaymentList = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const confirm = useConfirm()

    const paymentItems = useSelector((state: IStateInterface) => state.payment.paymentItems)
    const payMethodItems = useSelector((state: IStateInterface) => state.payMethod.payMethodItems)
    const isLoading = useSelector((state: IStateInterface) => state.payment.isLoading)
    const [selected, setSelected] = useState<number[]>([])

    function refreshOnLoad(){
        const d1: string|null = localStorage.getItem(PAYMENT_PERIOD_START)
        const d2: string|null = localStorage.getItem(PAYMENT_PERIOD_END)
        if (d1 && d2){
            handleRefresh(new Date(d1), new Date(d2))
        }
    }

    useEffect(()=>{
        refreshOnLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=>{
            dispatch(loadPayMethodItems())
        }, [dispatch]
    )

    function handleRefresh(startDate: Date | null, endDate: Date | null, method?: number, numContract?: string){
        const date1 = startDate!.toISOString().slice(0, 10);
        const date2 = endDate!.toISOString().slice(0, 10);
        localStorage.setItem(PAYMENT_PERIOD_START, date1);
        localStorage.setItem(PAYMENT_PERIOD_END, date2);
        method ? localStorage.setItem(PAYMENT_METHOD, method.toString()) : localStorage.removeItem(PAYMENT_METHOD);

        dispatch(loadPaymentList(date1, date2, method))
    }

    /**
     * Поиск по номеру контракта
     * @param findText - строка поиска
     */
    async function onFindProductHandler(findText: string){
        if (findText) dispatch(loadPaymentList('', '', 0, findText))
    }

    /**
     * Обработчик удаления записей
     */
    function onDeleteHandle() {
        if (selected.length === 0 ) return;
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item) => {
                dispatch(deletePayment(item))
            })
        )
    }

    /**
     * Выбор оплаты
     * @param id - Код записи
     */
    function onClickTableItem(id: number){
        history.push(`/payments/${id}`)
    }

    return (
        <div className={classes.root}>
            <PaymentToolbar
                className={''}
                methods={payMethodItems}
                newItemUrl={'/payments/new'}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}
                onRefresh={handleRefresh}
            />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <PaymentTable
                        items={paymentItems}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
        </div>
    )
}

export default PaymentList;
