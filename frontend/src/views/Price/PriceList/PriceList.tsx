import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { PriceTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import SnackBarAlert from 'components/SnackBarAlert';
import { useConfirm } from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";
import {loadActualPriceList} from "../../../redux/actions/priceAction";
import {IStateInterface} from "../../../redux/rootReducer";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const PriceList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const priceList = useSelector((state: IStateInterface) => state.price.priceList);
    const isLoading = useSelector((state: IStateInterface) => state.price.isLoading);
    const errorValue = useSelector((state: IStateInterface) => state.price.error);
    const alertType = useSelector((state: any) => state.product.typeMessage);
    const hasError = useSelector((state: IStateInterface) => state.price.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {

    };

    useEffect( ()=>{
            dispatch(loadActualPriceList())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){

    }

    function onDeleteHandle() {
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item, i, selected) => {
            })
        )
        ;
    }

    function onClickTableItem(productId: number){
        const newItemUrl = `/price/${productId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Прайс-лист продукции'}
                newItemTitle={'Новый прайс'}
                newItemUrl={'/price/new'}
                findCaption={'Поиск продукции'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <PriceTable
                        items={priceList}
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

export default PriceList;
