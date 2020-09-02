import React, { useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Typography
} from '@material-ui/core';
import {IEmployeeWorkTimeItem} from 'types/model/employee';
import moment from "moment";
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
    tableRow: {

    }
}));

interface IWorkTimeTableProps{
    className: string;
    timeItems: IEmployeeWorkTimeItem[];
}

const WorkTimeTable = (props: IWorkTimeTableProps) => {
    const { className, timeItems, ...rest } = props

    const classes = useStyles()

    const [rowsPerPage, setRowsPerPage] = useState<number>(10)
    const [page, setPage] = useState<number>(0)


    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    }

    /**
     * Подсчитать сумму отработанных часов
     * @param items
     */
    function getSubTotalHours(items: IEmployeeWorkTimeItem[]) {
        return items.map(({ hours }) => hours).reduce((sum, i) => sum + i, 0);
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
                                    <TableCell>Продукция</TableCell>
                                    <TableCell>Линия</TableCell>
                                    <TableCell>Работа</TableCell>
                                    <TableCell>Начало</TableCell>
                                    <TableCell>Окончание</TableCell>
                                    <TableCell>Отработано часов</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeItems.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(item => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell>{item.product}</TableCell>
                                        <TableCell>{item.line}</TableCell>
                                        <TableCell>{item.work.name}</TableCell>
                                        <TableCell>{moment(item.periodStart).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell>{moment(item.periodEnd).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell align={'right'}>{item.hours}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={4}/>
                                    <TableCell>
                                        <Typography variant="body1">Итого</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>{getSubTotalHours(timeItems).toLocaleString('ru-RU')}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
                <TablePagination
                    component="div"
                    count={timeItems.length}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={rowsPerPageArray}
                    labelRowsPerPage='Строк на странице:'
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                />
            </CardActions>
        </Card>
    );
};

export default WorkTimeTable;
