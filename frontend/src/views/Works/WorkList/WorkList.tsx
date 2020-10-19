import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { WorkTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {IStateInterface} from "redux/rootReducer";
import { useConfirm } from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "utils/AppConst";
import {deleteWork, loadWorkList} from "../../../redux/actions/workAction";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const WorkList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();


    const worksItems = useSelector((state: IStateInterface) => state.works.workItems);
    const isLoading = useSelector((state: IStateInterface) => state.works.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
            dispatch(loadWorkList())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadWorkList(findText))
    }

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
            selected.forEach(async (item, i, selected) => {
                dispatch(deleteWork(item))
            })
        )
    }

    function onClickTableItem(id: number){
        history.push(`/catalogs/works/${id}`);
    }

    return (
        <div className={classes.root}>
        <DefaultToolbar
            className={''}
            title={'Виды работ'}
            newItemTitle={'Добавить'}
            newItemUrl={'/catalogs/works/new'}
            findCaption={'Поиск вида работ'}
            showDelete={true}
            onFind={onFindProductHandler}
            onDelete={onDeleteHandle}
        />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                        :
                        <WorkTable
                            workItems={worksItems}
                            onClickItem={onClickTableItem}
                            className={''}
                            onChangeSelected={setSelected}
                        />
                }
            </div>
    </div>
);
};

export default WorkList;
