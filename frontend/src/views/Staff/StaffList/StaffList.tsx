import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { StaffTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import { deleteStaff, loadStaffs } from "redux/actions/staffAction";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {useConfirm} from "material-ui-confirm";
import {IStateInterface} from "../../../redux/rootReducer";



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const StaffList = () => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const confirm = useConfirm()

    const staffs = useSelector((state: IStateInterface) => state.staff.staffs);
    const isLoading = useSelector((state: IStateInterface) => state.staff.isLoading);
    const [selected, setSelected] = useState<number[]>([]);


    useEffect( ()=>{
            dispatch(loadStaffs())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadStaffs(findText))
    }

    /**
     * Удалить выбранные записи
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
                dispatch(deleteStaff(item))
            })
        )

    }

    function onClickTableItem(id: number){
        const newItemUrl = `/org/staff/${id}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Должности'}
                newItemTitle={'Новая должность'}
                newItemUrl={'/org/staff/new'}
                findCaption={'Поиск должности'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <StaffTable
                        items={staffs}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
        </div>
    );
};

export default StaffList;
