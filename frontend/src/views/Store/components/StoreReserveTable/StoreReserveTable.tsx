import React, {useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Button, Tooltip} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';
import DomainIcon from '@material-ui/icons/Domain';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import {
    Card,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination
} from '@material-ui/core';
import {IStoreJournal, IStoreListReserveProduct} from "types/model/store";
import moment from "moment";

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

interface IStoreReserveTableProps{
    className: string,
    store: IStoreListReserveProduct[],
    onClickItem: any
}


const StoreReserveTable = (props: IStoreReserveTableProps) => {
    const { className, store, onClickItem, ...rest } = props;
    const classes = useStyles();

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);


    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (clientId: number) => {
        onClickItem(clientId);
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
                                    <TableCell>Дата постановки в резерв</TableCell>
                                    <TableCell>Дата снятия</TableCell>
                                    <TableCell>Материал</TableCell>
                                    <TableCell>Тара</TableCell>
                                    <TableCell>Кол-во</TableCell>
                                    <TableCell>Поставил</TableCell>
                                    <TableCell>Для клиента</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    store.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(item => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell>
                                                <Typography variant="body1">{moment(item.start).format('DD/MM/YYYY')}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1">{moment(item.end).format('DD/MM/YYYY')}</Typography>
                                            </TableCell>
                                            <TableCell>{item.material}</TableCell>
                                            <TableCell>{item.tare}</TableCell>
                                            <TableCell>{item.value}</TableCell>
                                            <TableCell>{item.employee}</TableCell>
                                            <TableCell>{item.contract}</TableCell>
                                            <TableCell align="right"><Button variant="outlined" color="primary" onClick={event => cellClicked(item.id)}>Подробнее</Button></TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
                <TablePagination
                    component="div"
                    count={store.length}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage='Строк на странице:'
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                />
            </CardActions>
        </Card>
    );
};

export default StoreReserveTable;
