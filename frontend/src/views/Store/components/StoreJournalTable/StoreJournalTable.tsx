import React, {useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/core/styles';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';
import DomainIcon from '@material-ui/icons/Domain';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import {
    Card,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    Button,
    Tooltip
} from '@material-ui/core';
import {IStoreJournal} from "types/model/store";
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
    tableRow: {}
}));

interface IStoreJournalTableProps {
    className: string,
    store: IStoreJournal[],
    onClickItem: any
}


const StoreJournalTable = (props: IStoreJournalTableProps) => {
    const {className, store, onClickItem, ...rest} = props;

    const classes = useStyles();

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);


    const handlePageChange = (event: any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (clientId: number) => {
        onClickItem(clientId);
    };

    /**
     * Отобразить иконку по виду операции
     * @param state Код операции (0- приход, 1 - расход)
     */
    const getStateIcon = (state: number) => {
        if (state === 0) {
            return <Tooltip title={'Приход'} children={<RedoIcon/>}/>
        } else {
            return <Tooltip title={'Расход'} children={<UndoIcon/>}/>
        }
    }

    const getRecordIcon = (item: IStoreJournal) => {
        if (item.factoryId) {
            return <Tooltip title={'Оборот по производственной карте'} children={<DomainIcon/>}/>
        } else if (item.costId) {
            return <Tooltip title={'Оборот по затратам'} children={<AccountBalanceWalletOutlinedIcon/>}/>
        } else {
            return null
        }
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
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Опер.</TableCell>
                                    <TableCell>Материал</TableCell>
                                    <TableCell>Тара</TableCell>
                                    <TableCell>Кол-во ед. тары</TableCell>
                                    <TableCell>Кол-во</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    store.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(item => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell>
                                                <Typography
                                                    variant="body1">
                                                    {moment(item.date).format('DD/MM/YYYY')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{getStateIcon(item.type)} {getRecordIcon(item)}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.tare}</TableCell>
                                            <TableCell>{item.count}</TableCell>
                                            <TableCell>{item.tareV * item.count}</TableCell>
                                            <TableCell align="right">
                                                <Button variant="outlined" color="primary"
                                                        onClick={event => cellClicked(item.id)}>Подробнее</Button>
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
                    count={store.length}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={rowsPerPageArray}
                    labelRowsPerPage='Строк на странице:'
                    labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                />
            </CardActions>
        </Card>
    );
};

export default StoreJournalTable;
