import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { StaffTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import { deleteStaff, loadStaffs } from "redux/actions/staffAction";



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const StaffList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const staffs = useSelector((state: any) => state.staff.staffs);
    const isLoading = useSelector((state: any) => state.staff.isLoading);
    //const errorValue = useSelector((state: any) => state.staff.error);
    //const hasError = useSelector((state: any) => state.staff.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    useEffect( ()=>{
            dispatch(loadStaffs())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadStaffs(findText))
    }

    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteStaff(item))
        });
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
