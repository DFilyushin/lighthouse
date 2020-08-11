import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { CostTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {deleteCostItem, getCostList} from "redux/actions/costAction";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const CostList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const costs = useSelector((state: any) => state.cost.items);
    const isLoading = useSelector((state: any) => state.cost.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect( ()=>{
            dispatch(getCostList())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        //dispatch(loadProduct(findText))
    }

    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteCostItem(item))
        });
    }

    function onClickTableItem(id: number){
        history.push(`/catalogs/cost/${id}`);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Статьи затрат'}
                newItemTitle={'Добавить'}
                newItemUrl={'/catalogs/cost/new'}
                findCaption={'Поиск'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <CostTable
                        costs={costs}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
        </div>
    );
};

export default CostList;
