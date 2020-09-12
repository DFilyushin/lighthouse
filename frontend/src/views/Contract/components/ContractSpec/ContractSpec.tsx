import {
    Hidden,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import React, {Fragment, useState} from "react";
import {IContractSpecItem} from "../../../../types/model/contract";
import {ContractSpecItem} from "../index";
import {RoundValue} from "../../../../utils/AppUtils";
import {ITare} from "../../../../types/model/tare";
import {IPrice} from "../../../../types/model/price";
import ContractReturnDialog from "../ContractReturnDialog";


interface IContractSpec {
    canEditContract: boolean;
    classes: any;
    showDeliveryBlock: boolean;
    items: IContractSpecItem[];
    onDeleteSpecItem: ((id: number) => void);
    onChangeSpecItem: ((item: IContractSpecItem) => void);
    onReserveItem: ((id: number) => void);
    products: IPrice[];
    tares: ITare[];
}


const ContractSpecTable = (props: IContractSpec) => {
    const {
        canEditContract, classes, showDeliveryBlock, onReserveItem,
        items, onDeleteSpecItem, tares, products, onChangeSpecItem
    } = props

    const [openDialog, setOpenDialog] = useState(false)
    const [itemId, setItemId] = useState(-1)

    const handleClose = () => {
        setOpenDialog(false);
    };

    /**
     * Возврат продукции
     * @param id Код спецификации
     */
    function onReturnItem(id: number) {
        setItemId(id)
        setOpenDialog(true)
    }


    /**
     * Общая сумма скидки
     */
    const getTotalSumDiscount = () => {
        return RoundValue(items.map(({itemDiscount}) => itemDiscount)
            .reduce((sum, i) => sum + i, 0))
    }

    /**
     * Общая сумма спецификации
     */
    const getTotalSpecSum = () => {
        return RoundValue(items.map(({itemTotal}) => itemTotal)
            .reduce((sum, i) => sum + i, 0))
    }


    return (
        <Fragment>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Продукт</TableCell>
                        <TableCell>Тара</TableCell>
                        <TableCell>Кол-во</TableCell>
                        <TableCell>Цена</TableCell>
                        <TableCell>Цена с НДС</TableCell>
                        <TableCell>Скидка, тенге</TableCell>
                        <TableCell>Итого, тенге</TableCell>
                        {showDeliveryBlock &&
                        <Hidden only={['xs', 'sm']}>
                            <TableCell>Отгрузка</TableCell>
                            <TableCell>Отгружен</TableCell>
                        </Hidden>
                        }
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        items.map((specItem: IContractSpecItem, index: number) => (
                            <ContractSpecItem
                                key={index}
                                className={''}
                                match={''}
                                item={specItem}
                                onDeleteItem={onDeleteSpecItem}
                                onChangeItem={onChangeSpecItem}
                                onReturnItem={onReturnItem}
                                onReserveItem={onReserveItem}
                                productItems={products}
                                tareItems={tares}
                                canEditItem={canEditContract}
                                showDeliveryBlock={showDeliveryBlock}
                            />
                        ))
                    }
                    {items.length > 0 &&
                    <TableRow>
                        <TableCell className={classes.footer_row} colSpan={6}>Итого
                            по спецификации</TableCell>
                        <TableCell
                            className={classes.footer_row}>{getTotalSumDiscount()}</TableCell>
                        <TableCell
                            className={classes.footer_row}>{getTotalSpecSum()}</TableCell>
                        <Hidden only={['xs', 'sm']}>
                            <TableCell/>
                            <TableCell/>
                        </Hidden>
                        <TableCell/>
                    </TableRow>
                    }
                </TableBody>
            </Table>
            {
                items.length > 0 &&
                <ContractReturnDialog
                    open={openDialog}
                    handleCloseDialog={handleClose}
                    onChangeItem={onChangeSpecItem}
                    item={items[items.findIndex(item => item.id === itemId)]}/>
            }
        </Fragment>
    )
}

export default ContractSpecTable