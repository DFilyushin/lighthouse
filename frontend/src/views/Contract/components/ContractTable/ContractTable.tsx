import React, {useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Button from '@material-ui/core/Button';
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
import {IContractListItem} from 'types/model/contract';
import ContractStateIcon from "../ContractStateIcon";

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
    contracts: IContractListItem[],
    onClickItem: any,
    onChangeSelected: any
};


const ClientTable = (props: IClientTable) => {
    const { className, contracts, onClickItem, onChangeSelected, ...rest } = props;

    const classes = useStyles();

    const [selectedContracts, setSelectedContracts] = useState<number[]> ([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { contracts } = props;

        let selectedContracts: number[];

        if (event.target.checked) {
            selectedContracts = contracts.map(contract => contract.id);
        } else {
            selectedContracts = [];
        }

        setSelectedContracts(selectedContracts);
        onChangeSelected(selectedContracts);
    };

    const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:number) => {
        const selectedIndex = selectedContracts.indexOf(id);
        let newSelectedItems: number[] = [];

        if (selectedIndex === -1) {
            newSelectedItems = newSelectedItems.concat(selectedContracts, id);
        } else if (selectedIndex === 0) {
            newSelectedItems = newSelectedItems.concat(selectedContracts.slice(1));
        } else if (selectedIndex === selectedContracts.length - 1) {
            newSelectedItems = newSelectedItems.concat(selectedContracts.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedItems = newSelectedItems.concat(
                selectedContracts.slice(0, selectedIndex),
                selectedContracts.slice(selectedIndex + 1)
            );
        }

        setSelectedContracts(newSelectedItems);
        onChangeSelected(newSelectedItems);
    };

    const handlePageChange = (event:any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (clientId: number) => {
        onClickItem(clientId);
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
                                            checked={selectedContracts.length === contracts.length}
                                            color="primary"
                                            indeterminate={
                                                selectedContracts.length > 0 &&
                                                selectedContracts.length < contracts.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell/>
                                    <TableCell>Клиент</TableCell>
                                    <TableCell>Номер</TableCell>
                                    <TableCell>Номер сист.</TableCell>
                                    <TableCell>Дата заключения</TableCell>
                                    <TableCell>Дата поставки</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    contracts.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(contract => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={contract.id}
                                            selected={selectedContracts.indexOf(contract.id) !== -1}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedContracts.indexOf(contract.id) !== -1}
                                                    color="primary"
                                                    onChange={event => handleSelectOne(event, contract.id)}
                                                    value="true"
                                                />
                                            </TableCell>
                                            <TableCell><ContractStateIcon stateIndex={contract.status}/></TableCell>
                                            <TableCell>
                                                <Typography variant="body1">{contract.clientName}</Typography>
                                            </TableCell>
                                            <TableCell>{contract.num}</TableCell>
                                            <TableCell>{contract.id}</TableCell>
                                            <TableCell>{contract.contractDate}</TableCell>
                                            <TableCell>{contract.estDelivery}</TableCell>
                                            <TableCell align="right"><Button variant="outlined" color="primary" onClick={event => cellClicked(contract.id)}>Открыть</Button></TableCell>
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
                    count={contracts.length}
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
