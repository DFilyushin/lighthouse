import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {ExpenseTable, ExpenseToolbar} from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import {IStateInterface} from "redux/rootReducer";
import {deleteExpense, loadExpenseList} from "redux/actions/expenseAction";
import {getCostList} from "redux/actions/costAction";
import {RouteComponentProps} from "react-router";
import {useConfirm} from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

interface IExpenseListProps extends RouteComponentProps{

}

const ExpenseList = (props: IExpenseListProps) => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const confirm = useConfirm()

    const query = new URLSearchParams(props.location.search)
    const querySource = query.get('source') || ''

    const costs = useSelector((state: IStateInterface) => state.cost.items)
    const expenses = useSelector((state: IStateInterface) => state.expense.items)
    const isLoading = useSelector((state: IStateInterface) => state.expense.isLoading)
    const [selected, setSelected] = useState<number[]>([])

    useEffect( ()=>{
        if (querySource === 'return' && expenses) {return}
        dispatch(loadExpenseList())
        dispatch(getCostList())
        // eslint-disable-next-line
        }, [dispatch]
    )

    /**
     * Удаление затраты
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
                dispatch(deleteExpense(item))
            })
        )
    }

    function onClickTableItem(id: number){
        const newItemUrl = `/expense/${id}`;
        history.push(newItemUrl);
    };

    function handleRefresh(){
        dispatch(loadExpenseList())
    }

    return (
        <div className={classes.root}>
            <ExpenseToolbar
                className={''}
                newItemUrl={'/expense/new'}
                onDelete={onDeleteHandle}
                onRefresh={handleRefresh}
                costs={costs}
            />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <ExpenseTable
                        items={expenses}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
        </div>
    );
};

export default ExpenseList;
