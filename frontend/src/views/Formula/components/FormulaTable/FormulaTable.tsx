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
import {IFormula} from "../../../../types/model/formula";
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

interface IFormulaTable{
    className: string,
    formulas: IFormula[],
    onClickItem: any,
    onChangeSelected: any,
}


const FormulaTable = (props: IFormulaTable) => {
    const { className, formulas, onClickItem, onChangeSelected, ...rest } = props;
    const classes = useStyles();
    const [selectedProducts, setSelectedProducts] = useState<number[]> ([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { formulas } = props;

        let selectedElements: number[];

        if (event.target.checked) {
            selectedElements = formulas.map(item => item.id);
        } else {
            selectedElements = [];
        }
        onChangeSelected(selectedElements);
        setSelectedProducts(selectedElements);
    };

    const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:number) => {
        const selectedIndex = selectedProducts.indexOf(id);
        let newSelectedEmployees: number[] = [];

        if (selectedIndex === -1) {
            newSelectedEmployees = newSelectedEmployees.concat(selectedProducts, id);
        } else if (selectedIndex === 0) {
            newSelectedEmployees = newSelectedEmployees.concat(selectedProducts.slice(1));
        } else if (selectedIndex === selectedProducts.length - 1) {
            newSelectedEmployees = newSelectedEmployees.concat(selectedProducts.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedEmployees = newSelectedEmployees.concat(
                selectedProducts.slice(0, selectedIndex),
                selectedProducts.slice(selectedIndex + 1)
            );
        }
        onChangeSelected(newSelectedEmployees);
        setSelectedProducts(newSelectedEmployees);
    };

    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (productId: number) => {
        onClickItem(productId);
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
                                            checked={selectedProducts.length === formulas.length}
                                            color="primary"
                                            indeterminate={
                                                selectedProducts.length > 0 &&
                                                selectedProducts.length < formulas.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Дата создания</TableCell>
                                    <TableCell>Наименование</TableCell>
                                    <TableCell>Рассчётное кол-во</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formulas.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(formula => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={formula.id}
                                        selected={selectedProducts.indexOf(formula.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedProducts.indexOf(formula.id) !== -1}
                                                color="primary"
                                                onChange={event => handleSelectOne(event, formula.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{formula.created}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{formula.product}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{formula.amount}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary" onClick={event => cellClicked(formula.id)}>Открыть</Button>
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
                    count={formulas.length}
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

export default FormulaTable;
