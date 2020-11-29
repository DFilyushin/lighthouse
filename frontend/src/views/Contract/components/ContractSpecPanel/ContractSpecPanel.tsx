import React, {useState} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem  from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ReceiptIcon from '@material-ui/icons/Receipt';
import {IContractSpecItem} from "../../../../types/model/contract";
import {RoundValue} from "../../../../utils/AppUtils";

interface IContractSpecPanel {
    items: IContractSpecItem[];
    onClickItem: (numItem: string) => void;
}

interface IPanelSpecItem{
    num: string;
    date: string;
    total: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
    }),
);


const ContractSpecPanel = (props: IContractSpecPanel) => {
    const {items, onClickItem} = props
    const classes = useStyles();

    const [selectedIndex, setSelectedIndex] = useState('1')

    /**
     * Получить сортированный уникальный список номеров спецификации
     */
    const getSpecNums = () => {
        const newList: IPanelSpecItem [] = []
        items.forEach((item) => {
            if (!newList.find(value => value.num === item.specNum)) {
                const newItem: IPanelSpecItem = {num: item.specNum, date: item.specDate, total: 0}
                newList.push(newItem)
            }
        })

        newList.forEach((item) => {
            item.total = RoundValue(items.filter(value => value.specNum === item.num)
                .reduce((sum, i) => sum + i.itemTotal, 0))
        })


        return newList.sort(function (a, b) {
            const nameA=a.num.toLowerCase()
            const nameB=b.num.toLowerCase()
            if (nameA < nameB) //сортируем строки по возрастанию
                return -1
            if (nameA > nameB)
                return 1
            return 0 // Никакой сортировки
        })
    }

    /**
     * Общая сумма спецификации
     */
    const getSpecTotalSum = () => {
        return RoundValue(items.map(({itemTotal}) => itemTotal).reduce((sum, i) => sum + i, 0))
    }

    return (
        <div className={classes.root}>
            <List component="nav" aria-label="secondary mailbox folders">
                {
                    getSpecNums().map((item)=>
                        (
                        <ListItem button
                                  key={item.num}
                                  selected={selectedIndex === item.num}
                                  onClick={()=> {
                                      onClickItem(item.num)
                                      setSelectedIndex(item.num)
                                  }}
                        >
                            <ListItemText primary={`#${item.num} ${ item.date ? " от " + item.date : ''}`} secondary={item.total} />
                        </ListItem>
                        )
                    )
                }
            </List>
            <Divider />
            <List component="nav" aria-label="secondary mailbox folders">
                <ListItem>
                    <ListItemIcon>
                        <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${getSpecTotalSum()} тенге`} />
                </ListItem>
            </List>
        </div>
    )
}

export default ContractSpecPanel
