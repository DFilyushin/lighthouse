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
    Paper
} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import moment from "moment";
import {IProductionList} from "types/model/production";
import ProductionStateIcon from "../ProductionStateIcon";
import Hidden from "@material-ui/core/Hidden";
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
    }
}));

interface IProductionTableProps{
    className: string,
    items: IProductionList[],
    onClickItem: any,
    onChangeSelected: any,
}


const ProductionTable = (props: IProductionTableProps) => {
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

    const cellClicked = (productId: number) => {
        onClickItem(productId);
    };

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
                                    <TableCell/>
                                    <Hidden only={['xs', 'sm']}>
                                        <TableCell>№</TableCell>
                                    </Hidden>
                                    <TableCell>Продукция</TableCell>
                                    <TableCell>Количество</TableCell>
                                    <TableCell>Начало цикла</TableCell>
                                    <Hidden only={['xs', 'sm']}>
                                        <TableCell>Окончание</TableCell>
                                        <TableCell>Руководитель</TableCell>
                                    </Hidden>
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
                                        <TableCell>
                                            <Typography variant="body1"><ProductionStateIcon stateIndex={item.state}/></Typography>
                                        </TableCell>
                                        <Hidden only={['xs', 'sm']}>
                                            <TableCell>
                                                <Typography variant="button">{item.id}</Typography>
                                            </TableCell>
                                        </Hidden>
                                        <TableCell>
                                            <Typography variant="body1">{item.product}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{item.calcValue}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">{moment(item.prodStart).format('DD/MM/YYYY')}</Typography>
                                        </TableCell>
                                        <Hidden only={['xs', 'sm']}>
                                            <TableCell>
                                                <Typography variant="body1">{moment(item.prodFinish).isValid() ? moment(item.prodFinish).format('DD/MM/YYYY'): ""}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1">{item.leaderName}</Typography>
                                            </TableCell>
                                        </Hidden>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary" onClick={event => cellClicked(item.id)}>Открыть</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
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

export default ProductionTable;
