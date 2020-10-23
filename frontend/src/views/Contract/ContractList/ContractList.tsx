import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {ContractTable, ContractToolbar} from '../components';
import {deleteContract, loadContractList, setShowOwnContract} from "redux/actions/contractAction";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {
    AccessGroups,
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES
} from "../../../utils/AppConst";
import {CONTRACT_UNDEFINED_STATE} from "../../../types/model/contract";
import {useConfirm} from "material-ui-confirm";
import AuthenticationService from "../../../services/Authentication.service";
import {getSetupReserveInterval} from "../../../redux/actions/setupAction";

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
    const contracts = useSelector((state: IStateInterface) => state.contract.contractItems)
    const showOnlyOwnContract = useSelector((state: IStateInterface) => state.contract.showOwnContract)
    const [selected, setSelected] = useState<number[]>([])
    const [contractStatus, setContractStatus] = useState(CONTRACT_UNDEFINED_STATE)

    useEffect(() => {
        dispatch(loadContractList(contractStatus, showOnlyOwnContract))
        dispatch(getSetupReserveInterval())
    }, [dispatch, contractStatus, showOnlyOwnContract]);

    function onClickTableItem(contractId: number) {
        history.push(`/contracts/${contractId}?source=contract`);
    }

    async function onFindClientHandler(findNum: string) {
        dispatch(loadContractList(CONTRACT_UNDEFINED_STATE, showOnlyOwnContract, findNum))
    }

    function onDeleteHandle() {
        if (selected.length === 0) return;
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
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
                showContractSelectorOwn={AuthenticationService.hasGroup(
                    [AccessGroups.BOSS, AccessGroups.ADMIN, AccessGroups.FINANCE, AccessGroups.BUH]
                )}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                        : <ContractTable
                            contracts={contracts}
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
