import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardActions,
    CardContent,
    Avatar,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination
} from '@material-ui/core';

import { getInitials } from '../../../../helpers/index';
import {IClientItem} from '../../../../IInterfaces';

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

interface IClientTable{
    className: string,
    clients: IClientItem[]
};



const ClientTable = (props: IClientTable) => {
    const { className, clients, ...rest } = props;

    const classes = useStyles();

    const [selectedClients, setSelectedClients] = useState<number[]> ([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { clients } = props;

        let selectedClients: number[];

        if (event.target.checked) {
            selectedClients = clients.map(client => client.id);
        } else {
            selectedClients = [];
        }

        setSelectedClients(selectedClients);
    };

    const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:number) => {
        const selectedIndex = selectedClients.indexOf(id);
        let newSelectedClients: number[] = [];

        if (selectedIndex === -1) {
            newSelectedClients = newSelectedClients.concat(selectedClients, id);
        } else if (selectedIndex === 0) {
            newSelectedClients = newSelectedClients.concat(selectedClients.slice(1));
        } else if (selectedIndex === selectedClients.length - 1) {
            newSelectedClients = newSelectedClients.concat(selectedClients.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedClients = newSelectedClients.concat(
                selectedClients.slice(0, selectedIndex),
                selectedClients.slice(selectedIndex + 1)
            );
        }

        setSelectedClients(newSelectedClients);
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
                                            checked={selectedClients.length === clients.length}
                                            color="primary"
                                            indeterminate={
                                                selectedClients.length > 0 &&
                                                selectedClients.length < clients.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Наименование</TableCell>
                                    <TableCell>Адрес</TableCell>
                                    <TableCell>Контакты</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clients.slice(0, rowsPerPage).map(client => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={client.id}
                                        selected={selectedClients.indexOf(client.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedClients.indexOf(client.id) !== -1}
                                                color="primary"
                                                onChange={event => handleSelectOne(event, client.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{client.name}</Typography>
                                        </TableCell>
                                        <TableCell>{client.addr_reg}</TableCell>
                                        <TableCell>{client.employee}</TableCell>
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
                    count={clients.length}
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

export default ClientTable;
