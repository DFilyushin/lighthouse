import React from 'react';
import {IContractSpecItem} from "types/model/contract";
import {
    IconButton,
    Hidden,
    Tooltip,
    Paper,
    TableCell,
    TableRow,
    TextField
} from "@material-ui/core";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import WarningIcon from '@material-ui/icons/Warning';
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDialog} from "../../../../components/SelectDialog";
import {ITare} from "../../../../types/model/tare";
import {IPrice} from "../../../../types/model/price";


interface IContractSpecItemProps {
    className: string;
    match: any;
    item: IContractSpecItem;
    onDeleteItem: ((id: number) => void);
    onChangeItem: ((item: IContractSpecItem) => void);
    onReturnItem: ((id: number) => void);
    onReserveItem: ((id: number) => void);
    productItems: IPrice[];
    tareItems: ITare[];
    canEditItem: boolean;
    showDeliveryBlock: boolean;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0)
    },
    paper: {
        width: '100%',
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
        padding: 0,
    },
    textFieldSmallControl: {
        maxWidth: 60,
    },
    textFieldMediumControl: {
        maxWidth: 100,
        width: 80
    }
}));


const ContractSpecItem = (props: IContractSpecItemProps) => {
    const {item, onDeleteItem, onChangeItem, onReturnItem, productItems, tareItems,
        onReserveItem, canEditItem, showDeliveryBlock} = props;

    const classes = useStyles();
    const selectDialog = useDialog();

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


    /**
     * Сменить продукцию
     */
    const handleChangeProduct = () => {
        selectDialog(
            {
                title: 'Выбор продукции',
                description: '',
                confirmationText: 'Выбрать',
                cancellationText: 'Отменить',
                dataItems: productItems,
                initKey: 0,
                valueName: 'productName'
            }
        ).then((value: any) => {
                const newItem = {...item};
                const idPrice = productItems.findIndex((elem: IPrice, index: number, array: IPrice[]) => {
                    return elem.id === value.id
                })
                const priceItem = productItems[idPrice]

                newItem.product.id = priceItem.productId;
                newItem.product.name = priceItem.productName;
                newItem.itemPrice = priceItem.price
                newItem.tare.id = priceItem.tareId
                newItem.tare.name = priceItem.tareName
                newItem.tare.v = priceItem.tareV
                onChangeItem(newItem)
            }
        );
    };

    /**
     * Сменить продукцию
     */
    const handleChangeTare = () => {
        selectDialog(
            {
                title: 'Выбор тары',
                description: '',
                confirmationText: 'Выбрать',
                cancellationText: 'Отменить',
                dataItems: tareItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const newItem = {...item};
                newItem.tare.id = value.id;
                newItem.tare.name = value.name;
                onChangeItem(newItem)
            }
        );
    };


    return (
        <TableRow key={item.id}>
            <TableCell>
                {
                    item.returned &&
                    <Tooltip title={`Возврат продукции от ${item.returned} ${item.returnCause ? "по причине " + item.returnCause : ''}`}>
                        <WarningIcon color={"error"}/>
                    </Tooltip>
                }
            </TableCell>
            <TableCell>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        margin="dense"
                        name="productName"
                        required
                        value={item.product.name}
                        id="productName"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                onClick={handleChangeProduct}>
                        <MenuOpenIcon/>
                    </IconButton>
                </Paper>
            </TableCell>
            <TableCell>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        margin="dense"
                        name="tareName"
                        required
                        value={item.tare.name}
                        id="tareItem"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                onClick={handleChangeTare}>
                        <MenuOpenIcon/>
                    </IconButton>
                </Paper>
            </TableCell>
            <TableCell>
                <TextField
                    className={classes.textFieldSmallControl}
                    type={'number'}
                    margin="dense"
                    name="itemCount"
                    onChange={handleChange}
                    required
                    value={item.itemCount}

                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="itemPrice"
                    onChange={handleChange}
                    required
                    value={item.itemPrice}
                    className={classes.textFieldMediumControl}
                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="priceNds"
                    required
                    value={Math.round(item.itemPrice * (item.itemNds / 100 + 1))}
                    InputProps={{
                        readOnly: true,
                    }}
                    className={classes.textFieldMediumControl}
                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    type={'number'}
                    margin="dense"
                    name="itemDiscount"
                    onChange={handleChange}
                    required
                    value={item.itemDiscount}
                    className={classes.textFieldMediumControl}
                />
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    margin="dense"
                    name="itemTotal"
                    required
                    value={item.itemTotal}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </TableCell>
            {showDeliveryBlock &&
            <Hidden only={['xs', 'sm']}>
                <TableCell>
                    <TextField
                        className=''
                        id="dp_delivery"
                        type={"date"}
                        margin="dense"
                        name="delivery"
                        value={item.delivery || null}
                        onChange={handleChange}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        className=''
                        id="dp_delivered"
                        type={"date"}
                        margin="dense"
                        name="delivered"
                        value={item.delivered || null}
                        onChange={handleChange}
                    />
                </TableCell>
            </Hidden>
            }
            {
                canEditItem &&
                <TableCell align={"right"}>
                    <Tooltip title={'Поставить продукцию в резерв'}>
                        <IconButton color="primary" aria-label="delete" onClick={event => onReserveItem(item.id)}>
                            <LocalParkingIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={'Возврат продукции'}>
                        <IconButton color="primary" aria-label="delete" onClick={event => onReturnItem(item.id)}>
                            <Rotate90DegreesCcwIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={'Удалить запись'}>
                        <IconButton color="secondary" aria-label="delete" onClick={event => onDeleteItem(item.id)}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </TableCell>

            }
        </TableRow>
    )
}

export default ContractSpecItem;
