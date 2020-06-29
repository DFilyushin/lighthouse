import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { FactoryLineTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {IStateInterface} from "redux/rootReducer";
import {deleteFactoryItem, loadFactoryLines} from "redux/actions/factoryLineAction";
import { useConfirm } from "material-ui-confirm";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const FactoryLineList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const items = useSelector((state: IStateInterface) => state.factoryLine.items);
    const isLoading = useSelector((state: IStateInterface) => state.factoryLine.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
            dispatch(loadFactoryLines())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadFactoryLines(findText))
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
                dispatch(deleteFactoryItem(item))
            })
        )

    }

    function onClickTableItem(id: number){
        const newItemUrl = `/catalogs/lines/${id}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Линии производства'}
                newItemTitle={'Новая'}
                newItemUrl={'/catalogs/lines/new'}
                findCaption={'Поиск'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <FactoryLineTable
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

export default FactoryLineList;
