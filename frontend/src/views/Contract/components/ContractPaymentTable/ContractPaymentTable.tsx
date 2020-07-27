import {IPaymentContractItem} from "types/model/contract";
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
} from "@material-ui/core";
import clsx from "clsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";


export interface IContractPaymentTableProps {
    className: string;
    items: IPaymentContractItem[];
    onClickTableItem: ( (id: number)=> void);
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
    tableRow: {

    }
}));



const ContractPaymentTable = (props: IContractPaymentTableProps) => {
    const { className, items, onClickTableItem, ...rest } = props;
    const classes = useStyles();

    function subtotal(items: IPaymentContractItem[]) {
        return items.map(({ value }) => value).reduce((sum, i) => sum + i, 0);
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
                                {
                                    items.map(item => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell>
                                                <Typography variant="body1">{moment(item.date).format('DD/MM/YYYY')}</Typography>
                                            </TableCell>
                                            <TableCell>{item.num}</TableCell>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell align="right">{item.value.toLocaleString('ru-RU')}</TableCell>
                                            <TableCell align="right"><Button variant="outlined" color="primary" onClick={event => onClickTableItem(item.id)}>Подробнее</Button></TableCell>
                                        </TableRow>
                                    ))}
                                <TableRow>
                                    <TableCell colSpan={2}/>
                                    <TableCell>
                                        <Typography variant="body1">Итого</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>{subtotal(items).toLocaleString('ru-RU')}</TableCell>
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