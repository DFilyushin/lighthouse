import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
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
import {IEmployeeTableItem} from '../../../../IInterfaces';

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

interface IEmployeesTable{
    className: string,
    employees: IEmployeeTableItem[]
};



const EmployeeTable = (props: IEmployeesTable) => {
    const { className, employees, ...rest } = props;

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

        setSelectedEmployees(selectedEmployees);
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

        setSelectedEmployees(newSelectedEmployees);
    };

    const handlePageChange = (event:any, page: number) => {
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
                                    <TableCell>Дата рождения</TableCell>
                                    <TableCell>Должность</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.slice(0, rowsPerPage).map(employee => (
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
                                            <Typography variant="body1">{employee.tab_num}</Typography>
                                        </TableCell>
                                        <TableCell>{employee.fio}</TableCell>
                                        <TableCell>{moment(employee.dob).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell>{employee.staff}</TableCell>
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
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage='Строк на странице:'
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
                />
            </CardActions>
        </Card>
    );
};

export default EmployeeTable;
