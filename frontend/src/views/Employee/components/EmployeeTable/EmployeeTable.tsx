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
import {IEmployeeListItem} from 'types/model/employee';
import Button from "@material-ui/core/Button";
import {red} from "@material-ui/core/colors";
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
    fired: {
        color: red.A100
    }
}));

interface IEmployeesTable{
    className: string;
    employees: IEmployeeListItem[];
    onClickItem: any;
    onChangeSelected: any;
}



const EmployeeTable = (props: IEmployeesTable) => {
    const { className, employees, onClickItem, onChangeSelected, ...rest } = props;

    const classes = useStyles();

    const [selectedEmployees, setSelectedEmployees] = useState<number[]> ([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { employees } = props;

        let selectedEmployees: number[];

        if (event.target.checked) {
            selectedEmployees = employees.map(employee => employee.id);
        } else {
            selectedEmployees = [];
        }

        setSelectedEmployees(selectedEmployees)
        onChangeSelected(selectedEmployees)
    };

    const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:number) => {
        const selectedIndex = selectedEmployees.indexOf(id);
        let newSelectedEmployees: number[] = [];

        if (selectedIndex === -1) {
            newSelectedEmployees = newSelectedEmployees.concat(selectedEmployees, id);
        } else if (selectedIndex === 0) {
            newSelectedEmployees = newSelectedEmployees.concat(selectedEmployees.slice(1));
        } else if (selectedIndex === selectedEmployees.length - 1) {
            newSelectedEmployees = newSelectedEmployees.concat(selectedEmployees.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedEmployees = newSelectedEmployees.concat(
                selectedEmployees.slice(0, selectedIndex),
                selectedEmployees.slice(selectedIndex + 1)
            );
        }

        setSelectedEmployees(newSelectedEmployees)
        onChangeSelected(newSelectedEmployees)
    };

    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (id: number) => {
        onClickItem(id);
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
                                            checked={selectedEmployees.length === employees.length}
                                            color="primary"
                                            indeterminate={
                                                selectedEmployees.length > 0 &&
                                                selectedEmployees.length < employees.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Таб. номер</TableCell>
                                    <TableCell>Сотрудник</TableCell>
                                    <TableCell>Должность</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(employee => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={employee.id}
                                        selected={selectedEmployees.indexOf(employee.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedEmployees.indexOf(employee.id) !== -1}
                                                color="primary"
                                                onChange={event => handleSelectOne(event, employee.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" className={employee.fired ? classes.fired : ''}>{employee.tabNum}</Typography>
                                        </TableCell>
                                        <TableCell className={employee.fired ? classes.fired : ''}>{employee.fio}</TableCell>
                                        <TableCell>{employee.staff}</TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary" onClick={event => cellClicked(employee.id)}>Открыть</Button>
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
                    count={employees.length}
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

export default EmployeeTable;
