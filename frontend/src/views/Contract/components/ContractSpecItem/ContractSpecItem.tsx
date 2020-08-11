import React from 'react';
import {IContractSpecItem} from "types/model/contract";
import {
    IconButton,
    Fab,
    Hidden,
    Tooltip,
    Paper,
    TableCell,
    TableRow,
    TextField
} from "@material-ui/core";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {makeStyles} from "@material-ui/core/styles";
import {KeyboardDatePicker} from "@material-ui/pickers";
import DeleteIcon from "@material-ui/icons/Delete";
import {NumberFormatCustom} from 'components'
import {INVALID_DATE_FORMAT} from "../../../../utils/AppConst";

interface IContractSpecItemProps {
    className: string;
    match: any;
    item: IContractSpecItem;
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


const ContractSpecItem = (props: IContractSpecItemProps) => {
    const { item, onDeleteItem, onChangeItem } = props;

    const classes = useStyles();


    return (
        <TableRow>
            <TableCell>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        margin="dense"
                        name="clientName"
                        onChange={onChangeItem}
                        required
                        value={item.product.name}

                        id="IdClientName"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                        <MenuOpenIcon />
                    </IconButton>
                </Paper>
            </TableCell>
            <TableCell>
                <Paper  elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        margin="dense"
                        name="tareName"
                        onChange={onChangeItem}
                        required
                        value={item.tare.name}

                        id="tareItem"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                        <MenuOpenIcon />
                    </IconButton>
                </Paper>
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="num"
                    onChange={onChangeItem}
                    required
                    value={item.itemCount}

                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="num"
                    onChange={onChangeItem}
                    required
                    value={item.itemPrice}

                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="num"
                    onChange={onChangeItem}
                    required
                    value={item.itemDiscount}
                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    margin="dense"
                    name="num"
                    onChange={onChangeItem}
                    required
                    value={item.itemTotal}
                    InputProps={{
                        inputComponent: NumberFormatCustom as any,
                    }}
                />
            </TableCell>
            <Hidden only={['xs', 'sm']}>
                <TableCell>
                    <KeyboardDatePicker
                        className=''
                        id="dp_delivery"
                        format="dd/MM/yyyy"
                        margin="dense"
                        name="delivery"
                        value={item.delivery || null}
                        onChange={onChangeItem}
                        invalidDateMessage={INVALID_DATE_FORMAT}
                    />
                </TableCell>
                <TableCell>
                    <KeyboardDatePicker
                        className=''
                        id="dp_delivered"
                        format="dd/MM/yyyy"
                        margin="dense"
                        name="delivered"
                        value={item.delivered || null}
                        onChange={onChangeItem}
                        invalidDateMessage={INVALID_DATE_FORMAT}
                    />
                </TableCell>
            </Hidden>
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

export default ContractSpecItem;