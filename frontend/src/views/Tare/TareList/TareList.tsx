import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { TareTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {deleteTare, loadTare} from "redux/actions/tareAction";
import {IStateInterface} from "redux/rootReducer";
import { useConfirm } from "material-ui-confirm";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const TareList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();


    const tares = useSelector((state: IStateInterface) => state.tare.tareItems);
    const isLoading = useSelector((state: IStateInterface) => state.tare.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
            dispatch(loadTare())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadTare(findText))
    }

    function onDeleteHandle() {
        confirm(
            {
                'title': 'Подтверждение',
                description: `Удалить выбранные записи?.`,
                confirmationText:'Да',
                cancellationText: 'Нет'
            }
        ).then(() =>
            selected.forEach(async (item, i, selected) => {
                dispatch(deleteTare(item))
            })
        )
    }

    function onClickTableItem(tareId: number){
        const newItemUrl = `/catalogs/tare/${tareId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
        <DefaultToolbar
            className={''}
            title={'Упаковочная тара продукции'}
            newItemTitle={'Новая тара'}
            newItemUrl={'/catalogs/tare/new'}
            findCaption={'Поиск упаковочной тары'}
            showDelete={true}
            onFind={onFindProductHandler}
            onDelete={onDeleteHandle}
        />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                        :
                        <TareTable
                            tareItems={tares}
                            onClickItem={onClickTableItem}
                            className={''}
                            onChangeSelected={setSelected}
                        />
                }
            </div>
    </div>
);
};

export default TareList;
