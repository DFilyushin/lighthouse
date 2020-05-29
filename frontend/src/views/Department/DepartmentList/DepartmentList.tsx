import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { DepartmentTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {IStateInterface} from "redux/rootReducer";
import {deleteDepartment, loadDepartments} from "redux/actions/departmentAction";


//FIXME Отсутствует поиск в ендпоинте

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const DepartmentList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const items = useSelector((state: IStateInterface) => state.department.items);
    const isLoading = useSelector((state: IStateInterface) => state.department.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
            dispatch(loadDepartments())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadDepartments(findText))
    }

    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteDepartment(item))
        });
    }

    function onClickTableItem(id: number){
        history.push(`/org/structure/${id}`);
    };

    return (
        <div className={classes.root}>
            {console.log('items', items)}
            <DefaultToolbar
                className={''}
                title={'Структура предприятия'}
                newItemTitle={'Новая'}
                newItemUrl={'/org/structure/new'}
                findCaption={'Поиск'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <DepartmentTable
                        items={items}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
        </div>
    );
};

export default DepartmentList;
