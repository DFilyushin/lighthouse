import React, { useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination
} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import {IExpenseTableItem} from "types/model/expense";
import {RoundValue} from "../../../../utils/AppUtils";
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

    },
    footer_row: {
        fontSize: "1.3rem",
    }
}));

interface IExpenseTableProps{
    className: string,
    items: IExpenseTableItem[],
    onClickItem: any,
    onChangeSelected: any,
}


const ExpenseTable = (props: IExpenseTableProps) => {
    const { className, items, onClickItem, onChangeSelected, ...rest } = props;
    const classes = useStyles();
    const [selectedItems, setSelectedItems] = useState<number[]> ([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { items } = props;

        let selectedElements: number[];

        if (event.target.checked) {
            selectedElements = items.map(item => item.id);
        } else {
            selectedElements = [];
        }
        onChangeSelected(selectedElements);
        setSelectedItems(selectedElements);
    };

    const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:number) => {
        const selectedIndex = selectedItems.indexOf(id);
        let newSelectedItems: number[] = [];

        if (selectedIndex === -1) {
            newSelectedItems = newSelectedItems.concat(selectedItems, id);
        } else if (selectedIndex === 0) {
            newSelectedItems = newSelectedItems.concat(selectedItems.slice(1));
        } else if (selectedIndex === selectedItems.length - 1) {
            newSelectedItems = newSelectedItems.concat(selectedItems.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedItems = newSelectedItems.concat(
                selectedItems.slice(0, selectedIndex),
                selectedItems.slice(selectedIndex + 1)
            );
        }
        onChangeSelected(newSelectedItems);
        setSelectedItems(newSelectedItems);
    };

    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (itemId: number) => {
        onClickItem(itemId);
    };

    /**
     * Сумма расходов
     */
    const getTotalTableSum = () => {
        return RoundValue(items.map(({ total }) => total).reduce((sum, i) => sum + i, 0));
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
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedItems.length === items.length}
                                            color="primary"
                                            indeterminate={
                                                selectedItems.length > 0 &&
                                                selectedItems.length < items.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Наименование затрат</TableCell>
                                    <TableCell>Сумма, тнг</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(expenseItem => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={expenseItem.id}
                                        selected={selectedItems.indexOf(expenseItem.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedItems.indexOf(expenseItem.id) !== -1}
                                                color="primary"
                                                onChange={event => handleSelectOne(event, expenseItem.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{expenseItem.date}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{expenseItem.cost}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{expenseItem.total}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary" onClick={event => cellClicked(expenseItem.id)}>Открыть</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {items.length > 0 &&
                                    <TableRow>
                                        <TableCell className={classes.footer_row} colSpan={3}>Итого</TableCell>
                                        <TableCell
                                            className={classes.footer_row}>
                                            {getTotalTableSum()}
                                        </TableCell>
                                        <TableCell/>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
                <TablePagination
                    component="div"
                    count={items.length}
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

export default ExpenseTable;
