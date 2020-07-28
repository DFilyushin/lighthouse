import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { PayMethodTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import {IStateInterface} from "../../../redux/rootReducer";
import {deletePayMethod, loadPayMethodItems} from "../../../redux/actions/payMethodAction";



const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const PayMethodList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const payMethodItems = useSelector((state: IStateInterface) => state.payMethod.payMethodItems);
    const isLoading = useSelector((state: IStateInterface) => state.payMethod.isLoading);
    const [selected, setSelected] = useState<number[]>([]);


    useEffect( ()=>{
            dispatch(loadPayMethodItems())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadPayMethodItems())
    }

    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deletePayMethod(item))
        });
    }

    function onClickTableItem(id: number){
        const newItemUrl = `/catalogs/paymethod/${id}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Методы оплаты'}
                newItemTitle={'Новая запись'}
                newItemUrl={'/catalogs/paymethod/new'}
                findCaption={'Поиск'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <PayMethodTable
                        items={payMethodItems}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
        </div>
    );
};

export default PayMethodList;
