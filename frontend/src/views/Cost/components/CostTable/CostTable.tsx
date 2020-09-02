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
import {ICost} from "types/model/cost";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
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
    minColumn: {
        width: 32
    },
    avatar: {
        marginRight: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    },
    tableRow: {
    },
    childRow: {
        backgroundColor: theme.palette.action.selected
    }
}));

interface ICostTableProps{
    className: string;
    costs: ICost[];
    onClickItem: any;
    onChangeSelected: any;
}

const CostTable = (props: ICostTableProps) => {
    const { className, costs, onClickItem, onChangeSelected, ...rest } = props;

    const classes = useStyles();

    const [selectedCosts, setSelectedCost] = useState<number[]> ([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [hiden, setHiden] = useState<number[]>(costs.map((item)=>{return item.id}));

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const { costs } = props;
        let selectedItems: number[];

        if (event.target.checked) {
            selectedItems = costs.map(item => item.id);
        } else {
            selectedItems = [];
        }
        setSelectedCost(selectedItems);
    };

    const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:number) => {
        const selectedIndex = selectedCosts.indexOf(id);
        let newSelectedItems: number[] = [];

        if (selectedIndex === -1) {
            newSelectedItems = newSelectedItems.concat(selectedCosts, id);
        } else if (selectedIndex === 0) {
            newSelectedItems = newSelectedItems.concat(selectedCosts.slice(1));
        } else if (selectedIndex === selectedCosts.length - 1) {
            newSelectedItems = newSelectedItems.concat(selectedCosts.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedItems = newSelectedItems.concat(
                selectedCosts.slice(0, selectedIndex),
                selectedCosts.slice(selectedIndex + 1)
            );
        }
        onChangeSelected(newSelectedItems);
        setSelectedCost(newSelectedItems);
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

    const expandIconClick = (id: number)=>{
        const index = hiden.indexOf(id);
        index === -1 ? setHiden([...hiden, id]) : setHiden(hiden.filter((e)=>(e !== id)))
    }

    function getMoreIcon(cost: ICost){
        if (cost.childs.length ===0 ) {return null}
        return hiden.indexOf(cost.id)>-1
            ? <ExpandMoreIcon onClick={()=>{expandIconClick(cost.id)}}/>
        : <ExpandLessIcon onClick={()=>{expandIconClick(cost.id)}}/>
    }

    const getCostItem = (cost: ICost) => {
        return (
            <TableRow
                className={classes.tableRow}
                hover
                key={cost.id}
                selected={selectedCosts.indexOf(cost.id) !== -1}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedCosts.indexOf(cost.id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, cost.id)}
                        value="true"
                    />
                </TableCell>
                <TableCell className={classes.minColumn}>{getMoreIcon(cost)}</TableCell>
                <TableCell>
                    <Typography variant="body1">{cost.name}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Button variant="outlined" color="primary" onClick={event => cellClicked(cost.id)}>Открыть</Button>
                </TableCell>
            </TableRow>
        )
    }

    const getCostChilds = (cost: ICost) =>{
        return(
            cost.childs.map( (item, index) => {
                return(
                <TableRow className={classes.childRow}
                          hover
                          key={item.id}
                          selected={selectedCosts.indexOf(item.id) !== -1}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedCosts.indexOf(item.id) !== -1}
                            color="primary"
                            onChange={event => handleSelectOne(event, item.id)}
                            value="true"
                        />
                    </TableCell>
                    <TableCell className={classes.minColumn}/>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">
                        <Button variant="outlined" color="primary" onClick={event => cellClicked(item.id)}>Открыть</Button>
                    </TableCell>
                </TableRow>
                )
            })
        )
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
                                            checked={selectedCosts.length === costs.length}
                                            color="primary"
                                            indeterminate={
                                                selectedCosts.length > 0 &&
                                                selectedCosts.length < costs.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.minColumn}/>
                                    <TableCell>Наименование</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {costs.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map((cost) => {
                                    return ([
                                        getCostItem(cost),
                                        (cost.childs && hiden.indexOf(cost.id) ===-1) ? getCostChilds(cost) : null
                                    ])
                                })
                                }
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
                <TablePagination
                    component="div"
                    count={costs.length}
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

export default CostTable;
