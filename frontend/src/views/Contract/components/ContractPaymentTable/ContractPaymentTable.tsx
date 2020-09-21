import React from "react"
import moment from "moment"
import {makeStyles} from "@material-ui/core/styles"
import {useHistory} from "react-router-dom"
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
import {IPaymentContractItem} from "types/model/contract"

export interface IContractPaymentTableProps {
    className: string;
    contract: number;
    items: IPaymentContractItem[];
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


const ContractPaymentTable = (props: IContractPaymentTableProps) => {
    const {className, items, contract, onClickTableItem, ...rest} = props
    const classes = useStyles()
    const history = useHistory()

    /**
     * Подсчитать сумму платежей
     * @param items
     */
    function getSubTotalPayment(items: IPaymentContractItem[]) {
        return items.map(({value}) => value).reduce((sum, i) => sum + i, 0);
    }

    /**
     * Добавление нового платежа
     */
    const handleAddNewPayment = () => {
        history.push(`/payments/new/?contractId=${contract}&source=contract&id=${contract}`)
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
                                    <TableCell>Номер</TableCell>
                                    <TableCell>Вид оплаты</TableCell>
                                    <TableCell align={'right'}>Сумма</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Button
                                            className={classes.addButton}
                                            variant="contained"
                                            color="primary"
                                            onClick={(event) => {
                                                handleAddNewPayment()
                                            }}>
                                            Добавить оплату
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {
                                    items.map(item => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell>
                                                <Typography variant="body1">
                                                    {moment(item.date).format('DD/MM/YYYY')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{item.num}</TableCell>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell align="right">
                                                {item.value.toLocaleString('ru-RU')}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" color="primary"
                                                        onClick={event => onClickTableItem(item.id)}>Подробнее</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                <TableRow>
                                    <TableCell colSpan={2}/>
                                    <TableCell>
                                        <Typography variant="body1">Итого</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        {getSubTotalPayment(items).toLocaleString('ru-RU')}
                                    </TableCell>
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

export default ContractPaymentTable
