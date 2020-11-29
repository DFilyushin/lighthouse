import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {IContractSpecItem} from "../../../../types/model/contract";

interface IContractReturnDialog {
    open: boolean;
    handleCloseDialog: any;
    item: IContractSpecItem;
    onChangeItem: ( (item: IContractSpecItem)=> void);
}

const ContractReturnDialog = (props: IContractReturnDialog) => {
    const {open, handleCloseDialog, item, onChangeItem} = props

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        const property: string = event.target.name;
        // @ts-ignore
        const typeOfProperty: string = typeof (item[property]);
        if (typeOfProperty === 'number') {
            value = parseFloat(event.target.value);
        } else {
            value = event.target.value;
        }
        const newItem = {...item, [event.target.name]: value};
        onChangeItem(newItem)
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Возврат продукции</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Возврат продукции
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="returned"
                    name="returned"
                    label="Дата возврата"
                    fullWidth
                    value={item ? item.returned : ''}
                    type="date"
                    onChange={handleChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="returned"
                    name="returnValue"
                    label="Объём возврата. Если не указано, то в полном объёме"
                    fullWidth
                    value={item ? item.returnValue : ''}
                    onChange={handleChange}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="returnCause"
                    name="returnCause"
                    label="Причина возврата"
                    multiline
                    rows={3}
                    fullWidth
                    value={ item ? item.returnCause : ''}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Отменить
                </Button>
                <Button onClick={handleCloseDialog} color="primary">
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ContractReturnDialog
