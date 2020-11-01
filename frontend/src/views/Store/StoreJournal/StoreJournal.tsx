import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {StoreJournalTable} from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import {IStateInterface} from "redux/rootReducer";
import {StoreJournalToolbar} from "../components/StoreJournalToolbar";
import {loadStoreJournal} from "redux/actions/storeAction";
import {STORE_PERIOD_END, STORE_PERIOD_START} from "types/Settings";
import {RouteComponentProps} from "react-router";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

interface IStoreJournalProps extends RouteComponentProps {
    match: any
}

const StoreJournal = (props: IStoreJournalProps) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const query = new URLSearchParams(props.location.search);
    const querySource = query.get('refresh') || ''

    const journalItems = useSelector((state: IStateInterface) => state.store.storeJournal)
    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading)
    const [refresh, doRefresh] = useState(0); //отслеживание нажатия в StoreJournalToolbar


    function onClickTableItem(id: number){
        history.push(`/store/journal/${id}`);
    }

    useEffect(()=>{
        if (querySource) {
            doRefresh(prev => prev + 1)
        }
    }, [querySource])


    function onRefresh(startDate: string, endDate: string, state: number, material: number) {
        dispatch(loadStoreJournal(startDate, endDate, state, material))
        localStorage.setItem(STORE_PERIOD_START, startDate);
        localStorage.setItem(STORE_PERIOD_END, endDate);
    }

    return (
        <div className={classes.root}>
            <StoreJournalToolbar
                className={''}
                newItemUrl={'/store/raw/new'}
                writeOffUrl={'/store/raw/writeoff'}
                onRefresh={onRefresh}
                refresh={refresh}
            />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <StoreJournalTable
                        store={journalItems}
                        onClickItem={onClickTableItem}
                        className={''}
                    />
                }
            </div>
        </div>
    )
}

export default StoreJournal;
