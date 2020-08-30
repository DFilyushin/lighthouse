import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { EmployeeTable} from '../components';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {useHistory} from "react-router-dom";
import {deleteEmployee, loadEmployeeList} from "redux/actions/employeeAction";
import {DefaultToolbar} from "components";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {useConfirm} from "material-ui-confirm";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const EmployeeList = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const confirm = useConfirm()

    const [selected, setSelected] = useState<number[]>([])
    const employees = useSelector((state: IStateInterface)=> state.employee.items)

    useEffect(()=>{
        dispatch(loadEmployeeList())
    }, [dispatch])


    /**
     * Удалить записи
     */
    function onDeleteHandle() {
        if (selected.length === 0) return;

        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item) => {
                dispatch(deleteEmployee(item))
            })
        )

    }

    function onClickTableItem(id: number){
        history.push(`/org/employee/${id}`);
    }

    async function onFindHandler(findText: string){
        dispatch(loadEmployeeList(findText))
    }

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Сотрудники предприятия'}
                onDelete={onDeleteHandle}
                onFind={onFindHandler}
                findCaption={'Поиск сотрудника'}
                newItemTitle={'Новый сотрудник'}
                newItemUrl={'/org/employee/new/'}
                showDelete={true}
            />
            <div className={classes.content}>
                <EmployeeTable
                    employees={employees}
                    className={''}
                    onClickItem={onClickTableItem}
                    onChangeSelected={setSelected}
                />
            </div>
        </div>
    );
};

export default EmployeeList;
