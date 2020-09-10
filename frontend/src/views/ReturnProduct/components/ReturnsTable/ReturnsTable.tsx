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
    Button, Link
} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom'
import {rowsPerPageArray} from "../../../../utils/AppConst";
import {IReturnsList} from "../../../../types/model/returns";

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

interface IReturnsTable {
    className: string,
    returnItems: IReturnsList[],
    onClickItem: any
}


const ReturnsTable = (props: IReturnsTable) => {
    const {className, returnItems, onClickItem, ...rest} = props;

    const classes = useStyles();

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);


    const handlePageChange = (event: any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (contractId: number) => {
        onClickItem(contractId);
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
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Продукция</TableCell>
                                    <TableCell>Тара</TableCell>
                                    <TableCell>Кол-во</TableCell>
                                    <TableCell>Общая стоимость</TableCell>
                                    <TableCell>Контракт</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {returnItems.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(item => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.product}</TableCell>
                                        <TableCell>{item.tare}</TableCell>
                                        <TableCell>{item.count}</TableCell>
                                        <TableCell>{item.total}</TableCell>
                                        <TableCell>
                                            <Link
                                                color="inherit"
                                                component={RouterLink}
                                                to={`/contracts/${item.contractId}?source=return`}
                                            >
                                                <Typography
                                                    variant="body1">{`${item.contractNum} от ${item.contractDate} ${item.contractClient}`}</Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary"
                                                    onClick={event => cellClicked(item.id)}>Открыть</Button>
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
                    count={returnItems.length}
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

export default ReturnsTable;
