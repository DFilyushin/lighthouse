import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {ContractTable, ContractToolbar} from '../components';
import {deleteContract, loadContractList, setShowOwnContract} from "redux/actions/contractAction";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES, NO_SELECT_VALUE} from "../../../utils/AppConst";
import {CONTRACT_UNDEFINED_STATE} from "../../../types/model/contract";
import {useConfirm} from "material-ui-confirm";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ContractList = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const confirm = useConfirm()

    // @ts-ignore
    const isLoading = useSelector((state: IStateInterface) => state.contract.isLoading)
    const clients = useSelector((state: IStateInterface) => state.contract.items)
    const showOnlyOwnContract = useSelector((state: IStateInterface)=> state.contract.showOwnContract)
    const [selected, setSelected] = useState<number[]>([])
    const [contractStatus, setContractStatus] = useState(NO_SELECT_VALUE)

    useEffect(() => {
        dispatch(loadContractList(contractStatus, showOnlyOwnContract))
    }, [dispatch, contractStatus, showOnlyOwnContract]);

    function onClickTableItem(contractId: number){
        history.push(`/contracts/${contractId}?source=contract`);
    }

    async function onFindClientHandler(findNum: string){
        dispatch(loadContractList(CONTRACT_UNDEFINED_STATE, showOnlyOwnContract, findNum))
    }

    function onDeleteHandle() {
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() => {
            selected.forEach(async (item) => {
                dispatch(deleteContract(item))
            })
        })
    }

    function onNewItemHandler() {
        history.push('/contracts/new');
    }

    function onSetShowOwnContract(value: boolean) {
        dispatch(setShowOwnContract(value))
    }

    return (
        <div className={classes.root}>
            <ContractToolbar
                className={''}
                onFind={onFindClientHandler}
                onNew={onNewItemHandler}
                onDelete={onDeleteHandle}
                contractState={contractStatus}
                onSetState={setContractStatus}
                showOwnContract={showOnlyOwnContract}
                handleChangeHidden={onSetShowOwnContract}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                        : <ContractTable
                            contracts={clients}
                            className={''}
                            onClickItem={onClickTableItem}
                            onChangeSelected={setSelected}
                        />
                }
            </div>
        </div>
    );
};

export default ContractList;
