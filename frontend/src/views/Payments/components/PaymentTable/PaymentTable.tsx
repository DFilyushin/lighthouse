import React, { useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
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
    Paper,
    Button,
    Hidden
} from '@material-ui/core';
import moment from "moment";
import {IPaymentListItem} from "../../../../types/model/payment";
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
    footer_row: {
        fontSize: "1.3rem",
    }
}));

interface IPaymentTableProps{
    className: string,
    items: IPaymentListItem[],
    onClickItem: any,
    onChangeSelected: any,
}


const PaymentTable = (props: IPaymentTableProps) => {
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

    const cellClicked = (id: number) => {
        onClickItem(id);
    }

    /**
     * Общая сумма платежей
     */
    const getTotalTableSum = () => {
        return RoundValue(items.map(({ value }) => value).reduce((sum, i) => sum + i, 0));
    }

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardContent className={classes.content}>
                <TableContainer component={Paper}>
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
                                    <Hidden only={['xs', 'sm']}>
                                        <TableCell>№</TableCell>
                                    </Hidden>
                                    <TableCell>Сведения о контракте</TableCell>
                                    <Hidden only={['xs', 'sm']}>
                                        <TableCell>Дата оплаты</TableCell>
                                        <TableCell>№ док-та</TableCell>
                                    </Hidden>
                                    <TableCell>Вид платежа</TableCell>
                                    <TableCell>Сумма</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(item => (
                                    <TableRow
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
                                        <Hidden only={['xs', 'sm']}>
                                            <TableCell>
                                                <Typography variant="button">{item.id}</Typography>
                                            </TableCell>
                                        </Hidden>
                                        <TableCell>
                                            <Typography variant="h6" gutterBottom>
                                                {item.contract.client}
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {item.contract.num}
                                            </Typography>
                                        </TableCell>
                                        <Hidden only={['xs', 'sm']}>
                                            <TableCell>
                                                <Typography variant="button">{moment(item.date).format('DD/MM/YYYY')}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1">{item.num}</Typography>
                                            </TableCell>
                                        </Hidden>
                                        <TableCell>
                                            <Typography variant="body1">{item.type}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{item.value}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary" onClick={event => cellClicked(item.id)}>Открыть</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {items.length > 0 &&
                                <TableRow>
                                    <TableCell className={classes.footer_row} colSpan={3}>Итого: {getTotalTableSum()}</TableCell>
                                </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
                </TableContainer>
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

export default PaymentTable;
