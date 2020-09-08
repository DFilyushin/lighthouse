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
}

const ContractReturnDialog = (props: IContractReturnDialog) => {
    const {open, handleCloseDialog, item} = props

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
                    label="Дата возврата"
                    fullWidth
                    value={item ? item.returned : ''}
                    type="date"
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="returnCause"
                    label="Причина возврата"
                    multiline
                    rows={3}
                    fullWidth
                    value={ item ? item.returnCause : ''}
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