import React from 'react';
import {IWaitPaymentContractItem} from "types/model/contract";
import {
    Fab,
    Tooltip,
    TableCell,
    TableRow,
    TextField
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

interface IContractWaitItemProps {
    className: string;
    match: any;
    item: IWaitPaymentContractItem;
    onDeleteItem: any;
    onChangeItem: any;
}

const ContractWaitPaymentItem = (props: IContractWaitItemProps) => {
    const { item, onDeleteItem, onChangeItem } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        const property: string = event.target.name;
        // @ts-ignore
        const typeOfProperty: string = typeof (item[property]);
        if ( typeOfProperty === 'number') {
            value = parseFloat(event.target.value);
        }else{
            value =  event.target.value;
        }
        const newItem = {...item, [event.target.name]: value};
        onChangeItem(newItem)
    };


    return (
        <TableRow>
            <TableCell>
                <TextField
                    fullWidth
                    margin="dense"
                    name="waitDate"
                    onChange={handleChange}
                    required
                    value={item.waitDate}
                    id="waitDate"
                    type="date"
                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="waitSum"
                    onChange={handleChange}
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