import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {StoreJournalTable, StoreToolbar} from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import {IStateInterface} from "redux/rootReducer";
import {loadStoreByMaterial} from "redux/actions/storeAction";
import {RouteComponentProps} from "react-router";
import {CardChecklist} from 'react-bootstrap-icons'
import {getMaterialName} from "../../../redux/actions/materialAction";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

interface IStoreMaterialJournalProps extends RouteComponentProps {
    match: any
}

const StoreMaterialJournal = (props: IStoreMaterialJournalProps) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const materialId = props.match.params.material;
    const query = new URLSearchParams(props.location.search);
    const onDate = query.get('onDate') || ''

    const journalItems = useSelector((state: IStateInterface) => state.store.storeMaterialJournal)
    const isLoading = useSelector((state: IStateInterface) => state.store.isLoading)
    const [materialName, setMaterialName] = useState('')

    async function getMaterialNameTitle() {
        const value = await getMaterialName(materialId)
        setMaterialName(value)
    }

    function onClickTableItem(id: number){
        history.push(`/store/journal/${id}`);
    }

    useEffect(()=>{
        dispatch(loadStoreByMaterial(materialId, onDate))
        getMaterialNameTitle()
    }, // eslint-disable-next-line
        [dispatch])

    return (
        <div className={classes.root}>
            <StoreToolbar
                className={''}
                title={`Движение материала "${materialName}"`}
                icon={<CardChecklist color="primary" />}
                onReturn={"True"}
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

export default StoreMaterialJournal;
