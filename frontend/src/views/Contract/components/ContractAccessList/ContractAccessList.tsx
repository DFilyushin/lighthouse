import React, {useEffect} from "react"
import {makeStyles} from "@material-ui/core/styles"
import {
    Button,
    Card, CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core"
import clsx from "clsx"
import PerfectScrollbar from "react-perfect-scrollbar"
import {IContractManagerAccess} from "types/model/contract"
import {useDispatch, useSelector} from "react-redux";
import {
    addNewManagerItem,
    changeManagerAccessItem, deleteManagerAccessItem
} from "../../../../redux/actions/contractAction";
import ContractAccessItem from "../ContractAccessItem";
import {useDialog} from "../../../../components/SelectDialog";
import {DIALOG_CANCEL_TEXT, DIALOG_SELECT_TEXT} from "../../../../utils/AppConst";
import {IStateInterface} from "../../../../redux/rootReducer";
import {IEmployeeListItem} from "../../../../types/model/employee";
import {loadEmployeeList} from "../../../../redux/actions/employeeAction";


export interface IContractAccessTableProps {
    className: string;
    contract: number;
    items: IContractManagerAccess[];
}

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
    inner: {
        minWidth: 1050
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    },
    tableRow: {},
    addButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
}))


const ContractAccessTable = (props: IContractAccessTableProps) => {
    const {className, items, contract, ...rest} = props
    const classes = useStyles()
    const dispatch = useDispatch()
    const selectDialog = useDialog()

    const employees = useSelector((state: IStateInterface) => state.employee.employeeItems)

    function onDeleteItem(id: number) {
        dispatch(deleteManagerAccessItem(id))
    }

    function onChangeItem(item: IContractManagerAccess) {
        dispatch(changeManagerAccessItem(item))
    }

    useEffect(() => {
        dispatch(loadEmployeeList())
    }, [dispatch])

    /**
     * Добавление менеджера в список доступа
     */
    const handleAddNewManager = () => {
        selectDialog(
            {
                title: 'Выбор менеджера',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: employees,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value: any) => {
                const item: IEmployeeListItem = {id: value.id, fio: value.name, fired: '', tabNum: '', staff: ''}
                dispatch(addNewManagerItem(item))
            }
        );


        //dispatch(addNewManagerItem())
    }

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Сотрудник</TableCell>
                                    <TableCell>Дата</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Button
                                            className={classes.addButton}
                                            variant="contained"
                                            color="primary"
                                            onClick={(event) => {
                                                handleAddNewManager()
                                            }}>
                                            Добавить менеджера
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {
                                    items.map(item => (
                                        <ContractAccessItem
                                            className={''}
                                            match={''}
                                            item={item}
                                            onDeleteItem={onDeleteItem}
                                            onChangeItem={onChangeItem}
                                        />
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions>
            </CardActions>
        </Card>
    );
}

export default ContractAccessTable
