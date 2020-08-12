import React from 'react';
import {IWaitPaymentContractItem} from "types/model/contract";
import {
    Fab,
    Tooltip,
    TableCell,
    TableRow,
    TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";

interface IContractWaitItemProps {
    className: string;
    match: any;
    item: IWaitPaymentContractItem;
    onDeleteItem: any;
    onChangeItem: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1)
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center'
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    formControl: {
        margin: theme.spacing(0),
    },
    iconButton: {
        padding: 10,
    },
}));


const ContractWaitPaymentItem = (props: IContractWaitItemProps) => {
    const { item, onDeleteItem, onChangeItem } = props;

    const classes = useStyles();

    return (
        <TableRow>
            <TableCell>
                <TextField
                    fullWidth
                    margin="dense"
                    name="waitDate"
                    onChange={onChangeItem}
                    required
                    value={item.waitDate}
                    id="waitDate"
                    type="date"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="waitSum"
                    onChange={onChangeItem}
                    required
                    value={item.waitSum}
                />
            </TableCell>
            <TableCell>
                <Tooltip title={'Удалить запись'}>
                    <Fab color="secondary" aria-label="add" onClick={event => onDeleteItem(item.id)}>
                        <DeleteIcon />
                    </Fab>
                </Tooltip>
            </TableCell>
        </TableRow>
    )
}

export default ContractWaitPaymentItem;