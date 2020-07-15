import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {StoreJournalTable} from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import {IStateInterface} from "redux/rootReducer";
import {StoreJournalToolbar} from "../components/StoreJournalToolbar";
import {loadStoreJournal} from "redux/actions/storeAction";
import {STORE_PERIOD_END, STORE_PERIOD_START} from "types/Settings";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const StoreJournal = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const journalItems = useSelector((state: IStateInterface) => state.store.storeJournal)
    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading)

    function onClickTableItem(id: number){
        const url = ``;
        history.push(url);
    }

    function onRefresh(startDate: string, endDate: string, state: number) {
        dispatch(loadStoreJournal(startDate, endDate, state))
        localStorage.setItem(STORE_PERIOD_START, startDate);
        localStorage.setItem(STORE_PERIOD_END, endDate);
    }

    return (
        <div className={classes.root}>
            <StoreJournalToolbar
                className={''}
                newItemUrl={'/org/staff/new'}
                onRefresh={onRefresh}
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
