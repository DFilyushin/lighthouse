import React from 'react'
import clsx from 'clsx'
import {makeStyles} from '@material-ui/core/styles'
import {
    Card, CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@material-ui/core'
import {IEmployeeProduct} from 'types/model/employee'
import Button from "@material-ui/core/Button"

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
    avatar: {
        marginRight: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    },
    tableRow: {},
    addButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
}));

interface IEmployeeProductsProps {
    className: string;
    items: IEmployeeProduct[];
    onDeleteProduct: ((id: number) => void);
    onAddProduct: (() => void);
}

const EmployeeProducts = (props: IEmployeeProductsProps) => {
    const {className, items, onAddProduct, onDeleteProduct, ...rest} = props

    const classes = useStyles()


    const onDeleteItem = (id: number) => {
        onDeleteProduct(id)
    }


    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardContent>
                <Button
                    className={classes.addButton}
                    variant="contained"
                    color="primary"
                    onClick={(event) => {onAddProduct()}}>
                    Добавить продукцию
                </Button>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Продукция</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <TableRow
                                className={classes.tableRow}
                                hover
                                key={item.id}
                            >
                                <TableCell>{item.productName}</TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" color="secondary"
                                            onClick={event => onDeleteItem(item.id)}>Удалить</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default EmployeeProducts;
