import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import {
    Button,
    Card, CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core"
import clsx from "clsx"
import PerfectScrollbar from "react-perfect-scrollbar"
import {IWaitPaymentContractItem} from "types/model/contract"
import {useDispatch} from "react-redux";
import {
    addNewWaitPaymentItem, changePaymentWaitItem,
    deleteWaitPaymentItem
} from "../../../../redux/actions/contractAction";
import ContractWaitPaymentItem from "../ContractWaitPaymentItem";


export interface IContractWaitPaymentTableProps {
    className: string;
    contract: number;
    items: IWaitPaymentContractItem[];
    onClickTableItem: ((id: number) => void);
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


const ContractWaitPaymentTable = (props: IContractWaitPaymentTableProps) => {
    const {className, items, contract, onClickTableItem, ...rest} = props
    const classes = useStyles()
    const dispatch = useDispatch()

    /**
     * Подсчитать общую сумму
     * @param items
     */
    function getSubTotalPayment(items: IWaitPaymentContractItem[]) {
        return items.map(({waitSum}) => waitSum).reduce((sum, i) => sum + i, 0);
    }

    function onDeleteItem(id: number) {
        dispatch(deleteWaitPaymentItem(id))
    }

    function onChangeItem(item: IWaitPaymentContractItem) {
        dispatch(changePaymentWaitItem(item))
    }

    /**
     * Добавление нового сырья в рецептуру
     */
    const handleAddNewPayment = () => {
        dispatch(addNewWaitPaymentItem())
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
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Сумма</TableCell>
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
                                                handleAddNewPayment()
                                            }}>
                                            Добавить график
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {
                                    items.map(item => (
                                        <ContractWaitPaymentItem
                                            className={''}
                                            match={''}
                                            item={item}
                                            onDeleteItem={onDeleteItem}
                                            onChangeItem={onChangeItem}
                                        />
                                    ))
                                }
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body1">Итого</Typography>
                                    </TableCell>
                                    <TableCell
                                        align={'right'}>{getSubTotalPayment(items).toLocaleString('ru-RU')}</TableCell>
                                </TableRow>
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

export default ContractWaitPaymentTable
