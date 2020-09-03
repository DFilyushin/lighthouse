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
import {rowsPerPageArray} from "../../../../utils/AppConst";
import {IStock} from "../../../../types/model/stock";

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

interface IStockTableProps{
    className: string,
    stocks: IStock[],
    onClickItem: any,
    onChangeSelected: any,
}


const StockTable = (props: IStockTableProps) => {
    const { className, stocks, onClickItem, onChangeSelected, ...rest } = props;

    const classes = useStyles();

    const [selectedStockItems, setSelectedStockItems] = useState<number[]> ([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { stocks } = props;

        let selectedElements: number[];

        if (event.target.checked) {
            selectedElements = stocks.map(item => item.id);
        } else {
            selectedElements = [];
        }
        onChangeSelected(selectedElements);
        setSelectedStockItems(selectedElements);
    };

    const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:number) => {
        const selectedIndex = selectedStockItems.indexOf(id);
        let newSelectedItems: number[] = [];

        if (selectedIndex === -1) {
            newSelectedItems = newSelectedItems.concat(selectedStockItems, id);
        } else if (selectedIndex === 0) {
            newSelectedItems = newSelectedItems.concat(selectedStockItems.slice(1));
        } else if (selectedIndex === selectedStockItems.length - 1) {
            newSelectedItems = newSelectedItems.concat(selectedStockItems.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedItems = newSelectedItems.concat(
                selectedStockItems.slice(0, selectedIndex),
                selectedStockItems.slice(selectedIndex + 1)
            );
        }
        onChangeSelected(newSelectedItems);
        setSelectedStockItems(newSelectedItems);
    };

    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (stockId: number) => {
        onClickItem(stockId);
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
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedStockItems.length === stocks.length}
                                            color="primary"
                                            indeterminate={
                                                selectedStockItems.length > 0 &&
                                                selectedStockItems.length < stocks.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Наименование</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stocks.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(raw => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={raw.id}
                                        selected={selectedStockItems.indexOf(raw.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedStockItems.indexOf(raw.id) !== -1}
                                                color="primary"
                                                onChange={event => handleSelectOne(event, raw.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{raw.name}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary" onClick={event => cellClicked(raw.id)}>Открыть</Button>
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
                    count={stocks.length}
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

export default StockTable;