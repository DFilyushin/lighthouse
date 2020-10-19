import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { EmployeeTable} from '../components';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {useHistory} from "react-router-dom";
import {changeFiredStatus, deleteEmployee, loadEmployeeList} from "redux/actions/employeeAction";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {useConfirm} from "material-ui-confirm";
import EmployeesToolbar from "../components/EmployeesToolbar";

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
    const showFired = useSelector((state: IStateInterface)=> state.employee.showFired)
    const employees = useSelector((state: IStateInterface)=> state.employee.employeeItems)


    useEffect(()=>{
        dispatch(loadEmployeeList(showFired))
    }, [dispatch, showFired])


    function onSetShowFired(event: React.ChangeEvent<HTMLInputElement> ) {
        dispatch(changeFiredStatus(event.target.checked))
    }

    /**
     * Удалить записи
     */
    function onDeleteHandle() {
        if (selected.length === 0) return;

        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
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
        dispatch(loadEmployeeList(showFired, findText))
    }

    function onNewEmployee() {
        history.push(`/org/employee/new`);
    }

    return (
        <div className={classes.root}>
            <EmployeesToolbar
                className={''}
                onDelete={onDeleteHandle}
                onNew={onNewEmployee}
                handleChangeFired={onSetShowFired}
                showFired={showFired}
                onFind={onFindHandler}
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
