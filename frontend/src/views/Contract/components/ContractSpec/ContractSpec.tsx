import {
    Hidden,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import React, {Fragment} from "react";
import {IContractSpecItem} from "../../../../types/model/contract";
import {ContractSpecItem} from "../index";
import {RoundValue} from "../../../../utils/AppUtils";
import {ITare} from "../../../../types/model/tare";
import {IPrice} from "../../../../types/model/price";


interface IContractSpec {
    canEditContract: boolean;
    classes: any;
    showDeliveryBlock: boolean;
    items: IContractSpecItem[];
    onDeleteSpecItem: any;
    onChangeSpecItem: any;
    products: IPrice[];
    tares: ITare[];
}


const ContractSpecTable = (props: IContractSpec) => {
    const {canEditContract, classes, showDeliveryBlock,
        items, onDeleteSpecItem, tares, products, onChangeSpecItem} = props


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
                        <TableCell>Продукт</TableCell>
                        <TableCell>Тара</TableCell>
                        <TableCell>Количество</TableCell>
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
                        items.map((specItem: IContractSpecItem) => (
                            <ContractSpecItem
                                key={specItem.id}
                                className={''}
                                match={''}
                                item={specItem}
                                onDeleteItem={onDeleteSpecItem}
                                onChangeItem={onChangeSpecItem}
                                productItems={products}
                                tareItems={tares}
                                canEditItem={canEditContract}
                                showDeliveryBlock={showDeliveryBlock}
                            />
                        ))
                    }
                    {items.length > 0 &&
                    <TableRow>
                        <TableCell className={classes.footer_row} colSpan={5}>Итого
                            по контракту</TableCell>
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
        </Fragment>
    )
}

export default ContractSpecTable