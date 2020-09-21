import React, {useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/core/styles';
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
    TablePagination,
    Button,
    Link
} from '@material-ui/core';
import {IStoreListReserveProduct} from "types/model/store";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import {rowsPerPageArray} from "../../../../utils/AppConst";
import {Link as RouterLink} from 'react-router-dom'

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
    tableRow: {}
}));

interface IStoreReserveTableProps {
    className: string,
    store: IStoreListReserveProduct[],
    onClickItem: any,
    onDeleteItem: any
}


const StoreReserveTable = (props: IStoreReserveTableProps) => {
    const {className, store, onClickItem, onDeleteItem, ...rest} = props;
    const classes = useStyles();

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);


    const handlePageChange = (event: any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    /**
     * Переход к контракту
     * @param contractId
     */
    const cellClicked = (contractId: number) => {
        onClickItem(contractId);
    }

    /**
     * Удаление резерва
     * @param id Код записи
     */
    const deleteReserveHandler = (id: number) => {
        onDeleteItem(id)
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
                                    <TableCell>Поставлен</TableCell>
                                    <TableCell>До даты</TableCell>
                                    <TableCell>Материал</TableCell>
                                    <TableCell>Тара</TableCell>
                                    <TableCell>Кол-во в таре</TableCell>
                                    <TableCell>Кол-во в объёме</TableCell>
                                    <TableCell>Поставил</TableCell>
                                    <TableCell>Для клиента</TableCell>
                                    <TableCell/>
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
                                                <Typography
                                                    variant="body1">{moment(item.start).format('DD/MM/YYYY')}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body1">{moment(item.end).format('DD/MM/YYYY')}</Typography>
                                            </TableCell>
                                            <TableCell>{item.material}</TableCell>
                                            <TableCell>{item.tare}</TableCell>
                                            <TableCell>{item.value}</TableCell>
                                            <TableCell>{item.tareV * item.value}</TableCell>
                                            <TableCell>{item.employee}</TableCell>
                                            <TableCell>
                                                <Link
                                                    color="inherit"
                                                    component={RouterLink}
                                                    to={`/contracts/${item.contractId}/?source=reserved&id=${item.id}`}
                                                    variant="h6"
                                                >
                                                    {item.contract}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right"><Button
                                                variant="contained"
                                                color="secondary"
                                                startIcon={<DeleteIcon/>}
                                                onClick={event => deleteReserveHandler(item.id)}
                                            >
                                                Удалить
                                            </Button></TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" color="primary"
                                                        onClick={event => cellClicked(item.id)}>Подробнее</Button>
                                            </TableCell>
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
                    rowsPerPageOptions={rowsPerPageArray}
                    labelRowsPerPage='Строк на странице:'
                    labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                />
            </CardActions>
        </Card>
    );
};

export default StoreReserveTable;
