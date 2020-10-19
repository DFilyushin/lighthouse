import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { PriceTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { useConfirm } from "material-ui-confirm";
import {
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES, NO_SELECT_VALUE
} from "../../../utils/AppConst";
import {
    deletePriceList,
    loadActualPriceList,
    loadActualPriceListByEmployee,
    makePriceForEmployee
} from "../../../redux/actions/priceAction";
import {IStateInterface} from "../../../redux/rootReducer";

import PriceToolbar from "../components/PriceToolbar";
import {loadEmployeeList} from "../../../redux/actions/employeeAction";
import {useDialog} from "../../../components/SelectDialog";
import {loadTare} from "../../../redux/actions/tareAction";
import {loadProduct} from "../../../redux/actions/productAction";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

//FIXME Загружать сотрудников только менеджеров

const PriceList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const selectDialog = useDialog();

    const priceList = useSelector((state: IStateInterface) => state.price.priceList)
    const employees = useSelector((state: IStateInterface) => state.employee.employeeItems)
    const isLoading = useSelector((state: IStateInterface) => state.price.isLoading)
    const [selected, setSelected] = useState<number[]>([]);


    useEffect( ()=>{
        dispatch(loadEmployeeList())
        dispatch(loadTare())
        dispatch(loadProduct())
        dispatch(loadEmployeeList())
        }, [dispatch]
    )

    const onRefresh = (employee: number) => {
        if (employee === NO_SELECT_VALUE){
            dispatch(loadActualPriceList())
        }else{
            dispatch(loadActualPriceListByEmployee(employee))
        }

    }

    async function onFindProductHandler(findText: string){

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
                dispatch(deletePriceList(item))
            })
        )
        ;
    }

    function onClickTableItem(productId: number){
        const newItemUrl = `/price/${productId}`;
        history.push(newItemUrl);
    }

    function onClickHistoryItem(productId: number){
        history.push(`/price/history/${productId}`);
    }

    /**
     * Новый прайс-лист по шаблону
     */
    function newItemByTemplate() {
        selectDialog(
            {
                title: 'Выбор сотрудника',
                description: 'Выбрать сотрудника, на которого будет создан прайс-лист.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: employees,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value:any) => {
                dispatch(makePriceForEmployee(value.id));
            }
        );
    }

    return (
        <div className={classes.root}>
            <PriceToolbar
                className={''}
                newItemUrl={'/price/new'}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}
                employees={employees}
                onRefresh={onRefresh}
                onNewItemByTemplate={newItemByTemplate}
            />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <PriceTable
                        items={priceList}
                        showHistory={true}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                        onClickHistory={onClickHistoryItem}
                    />
                }
            </div>
        </div>
    );
};

export default PriceList;
