import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { UnitTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {IStateInterface} from "redux/rootReducer";
import {loadUnit, deleteItem} from "redux/actions/unitAction";
import { useConfirm } from "material-ui-confirm";
import {DIALOG_NO, DIALOG_YES} from "utils/AppConst";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const UnitList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const units = useSelector((state: IStateInterface) => state.unit.unitItems);
    const isLoading = useSelector((state: IStateInterface) => state.unit.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
            dispatch(loadUnit())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadUnit(findText))
    }

    function onDeleteHandle() {
        confirm(
            {
                'title': 'Подтверждение',
                description: `Удалить выбранные записи?.`,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item, i, selected) => {
                dispatch(deleteItem(item))
            })
        )
    }

    function onClickTableItem(unitId: number){
        const newItemUrl = `/catalogs/units/${unitId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
        <DefaultToolbar
            className={''}
    title={'Единицы измерения'}
    newItemTitle={'Новая ед. изм.'}
    newItemUrl={'/catalogs/units/new'}
    findCaption={'Поиск'}
    showDelete={true}
    onFind={onFindProductHandler}
    onDelete={onDeleteHandle}/>
    <div className={classes.content}>
        {isLoading ? <CircularIndeterminate/>
                :
                <UnitTable
                    unitItems={units}
                    onClickItem={onClickTableItem}
                    className={''}
                    onChangeSelected={setSelected}
                />
        }
    </div>
    </div>
);
};

export default UnitList;
