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
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const query = new URLSearchParams(props.location.search);
    const querySource = query.get('source') || ''

    const costs = useSelector((state: IStateInterface) => state.cost.items);
    const expenses = useSelector((state: IStateInterface) => state.expense.items);
    const isLoading = useSelector((state: IStateInterface) => state.expense.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
        if (querySource === 'return' && expenses) {return}
        dispatch(loadExpenseList())
        dispatch(getCostList())
        }, [dispatch]
    );

    /**
     * Удаление затраты
     */
    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteExpense(item))
        });
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
