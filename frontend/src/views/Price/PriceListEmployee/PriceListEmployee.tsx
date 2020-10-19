import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { PriceTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import { useConfirm } from "material-ui-confirm";
import {
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES
} from "../../../utils/AppConst";
import {deletePriceList, loadActualPriceListByEmployee} from "../../../redux/actions/priceAction";
import {IStateInterface} from "../../../redux/rootReducer";
import { ReactComponent as Price2 } from 'images/barcode.svg';
import AuthenticationService from "../../../services/Authentication.service";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));


const PriceListEmployee = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const priceList = useSelector((state: IStateInterface) => state.price.priceList);
    const isLoading = useSelector((state: IStateInterface) => state.price.isLoading);
    const [selected, setSelected] = useState<number[]>([]);


    useEffect( ()=>{
            dispatch(loadActualPriceListByEmployee(AuthenticationService.currentEmployeeId()))
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){

    }

    function onDeleteHandle() {
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

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={`Прайс-лист продукции (${AuthenticationService.currentEmployee()})`}
                newItemTitle={''}
                newItemUrl={'/price/new'}
                findCaption={'Поиск по продукции'}
                showDelete={false}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}
                icon={<Price2 color={"primary"}/>}
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

export default PriceListEmployee;
