import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {ExpenseTable, ExpenseToolbar} from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {deleteTare, loadTare} from "redux/actions/tareAction";
import {IStateInterface} from "redux/rootReducer";
import {deleteExpense, loadExpenseList} from "../../../redux/actions/expenseAction";
import {getCostList} from "../../../redux/actions/costAction";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ExpenseList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const costs = useSelector((state: IStateInterface) => state.cost.items);
    const expenses = useSelector((state: IStateInterface) => state.expense.items);
    const isLoading = useSelector((state: IStateInterface) => state.expense.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
        dispatch(loadExpenseList())
        dispatch(getCostList())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadTare(findText))
    }

    /**
     * Удаление затраты
     */
    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteExpense(item))
        });
    }

    function onClickTableItem(tareId: number){
        const newItemUrl = `/catalogs/tare/${tareId}`;
        history.push(newItemUrl);
    };

    function handleRefresh(){
        dispatch(loadExpenseList())
    }

    return (
        <div className={classes.root}>
            <ExpenseToolbar
                className={''}
                newItemUrl={'/catalogs/tare/new'}
                onFind={onFindProductHandler}
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
