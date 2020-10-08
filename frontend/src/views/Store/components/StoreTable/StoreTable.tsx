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
    TablePagination, Button
} from '@material-ui/core';
import {IStoreBase} from "../../../../types/model/store";
import {rowsPerPageArray} from "../../../../utils/AppConst";

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

interface IStoreTableProps {
    className: string,
    store: IStoreBase[],
    onClickItem: any
}


const StoreTable = (props: IStoreTableProps) => {
    const {className, store, onClickItem, ...rest} = props;

    const classes = useStyles();

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);


    const handlePageChange = (event: any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

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
                                    <TableCell>Наименование</TableCell>
                                    <TableCell>Тара</TableCell>
                                    <TableCell>Объём тары</TableCell>
                                    <TableCell>Ед. изм.</TableCell>
                                    <TableCell>Кол-во в таре</TableCell>
                                    <TableCell>Кол-во в объёме</TableCell>
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
                                                <Typography variant="body1">{item.name}</Typography>
                                            </TableCell>
                                            <TableCell>{item.tare}</TableCell>
                                            <TableCell>{item.v}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell>{item.total}</TableCell>
                                            <TableCell>{item.total * item.v}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" color="primary"
                                                        onClick={event => onClickItem(item.id)}>Подробнее</Button>
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

export default StoreTable;
