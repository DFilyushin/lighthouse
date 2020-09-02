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
    TablePagination,
    Button
} from '@material-ui/core';
import {IPrice} from "types/model/price";
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

interface IPriceTableProps{
    className: string,
    showHistory: boolean,
    items: IPrice[],
    onClickItem: any,
    onChangeSelected: any,
    onClickHistory?: any
}


const PriceTable = (props: IPriceTableProps) => {
    const { className, items, onClickItem, onChangeSelected, showHistory, onClickHistory, ...rest } = props;

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
        let newSelectedElements: number[] = [];

        if (selectedIndex === -1) {
            newSelectedElements = newSelectedElements.concat(selectedItems, id);
        } else if (selectedIndex === 0) {
            newSelectedElements = newSelectedElements.concat(selectedItems.slice(1));
        } else if (selectedIndex === selectedItems.length - 1) {
            newSelectedElements = newSelectedElements.concat(selectedItems.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedElements = newSelectedElements.concat(
                selectedItems.slice(0, selectedIndex),
                selectedItems.slice(selectedIndex + 1)
            );
        }
        onChangeSelected(newSelectedElements);
        setSelectedItems(newSelectedElements);
    };

    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    }

    const cellClicked = (id: number) => {
        onClickItem(id);
    }

    const cellClickedHistory = (id: number) => {
        if (onClickHistory) {onClickHistory(id)}
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
                                    <TableCell>Наименование</TableCell>
                                    <TableCell>Начало действия</TableCell>
                                    <TableCell>Цена</TableCell>
                                    {
                                        showHistory &&
                                            <TableCell/>
                                    }
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(item => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={item.id}
                                        selected={selectedItems.indexOf(item.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedItems.indexOf(item.id) !== -1}
                                                color="primary"
                                                onChange={event => handleSelectOne(event, item.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{item.productName}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{item.date}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{item.price}</Typography>
                                        </TableCell>
                                        {
                                            showHistory &&
                                            <TableCell align="right">
                                                <Button variant="outlined" color="primary" onClick={event => cellClickedHistory(item.productId)}>История</Button>
                                            </TableCell>
                                        }
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary" onClick={event => cellClicked(item.id)}>Открыть</Button>
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

export default PriceTable;
