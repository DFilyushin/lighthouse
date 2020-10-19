import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { RawTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {clearError, deleteRaw, loadRaws } from "redux/actions/rawAction";
import SnackBarAlert from 'components/SnackBarAlert';
import { useConfirm } from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const RawList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const raws = useSelector((state: IStateInterface) => state.raw.raws);
    const isLoading = useSelector((state: IStateInterface) => state.raw.isLoading);
    const errorValue = useSelector((state: IStateInterface) => state.raw.error);
    const alertType = useSelector((state: any) => state.raw.typeMessage);
    const hasError = useSelector((state: IStateInterface) => state.raw.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        dispatch(clearError())
    };

    useEffect( ()=>{
            dispatch(loadRaws())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadRaws(findText))
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
                dispatch(deleteRaw(item))
            })
        )
    }

    function onClickTableItem(rawId: number){
        const newItemUrl = `/catalogs/raw/${rawId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Сырьё'}
                newItemTitle={'Новое сырьё'}
                newItemUrl={'/catalogs/raw/new'}
                findCaption={'Поиск сырья'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <RawTable
                        raws={raws}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
            <SnackBarAlert
                typeMessage={alertType}
                messageText={errorValue}
                isOpen={hasError}
                onSetOpenState={handleClose}
            />
        </div>
    );
};

export default RawList;
