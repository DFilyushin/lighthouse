import React from "react"
import moment from "moment"
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
import {IStoreListReserveProduct} from "../../../../types/model/store";

export interface IContractReserveTableProps {
    className: string;
    contract: number;
    items: IStoreListReserveProduct[];
    onDeleteTableItem: ((id: number) => void);
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


const ContractReserveTable = (props: IContractReserveTableProps) => {
    const {className, items, contract, onDeleteTableItem, onClickTableItem, ...rest} = props
    const classes = useStyles()

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
                                    <TableCell>Продукция</TableCell>
                                    <TableCell>Тара</TableCell>
                                    <TableCell>Количество</TableCell>
                                    <TableCell>Поставлено</TableCell>
                                    <TableCell>На период</TableCell>
                                    <TableCell>Сотрудник</TableCell>
                                    <TableCell/>
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
                                            <TableCell>{item.material}</TableCell>
                                            <TableCell>{`${item.tare} ${item.tareV}`}</TableCell>
                                            <TableCell>{item.value}</TableCell>
                                            <TableCell>
                                                <Typography variant="body1">
                                                    {moment(item.start).format('DD/MM/YYYY')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1">
                                                    {moment(item.end).format('DD/MM/YYYY')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1">{item.employee}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" color="secondary"
                                                        onClick={event => onDeleteTableItem(item.id)}>Удалить
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" color="primary"
                                                        onClick={event => onClickTableItem(item.id)}>Подробнее
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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

export default ContractReserveTable