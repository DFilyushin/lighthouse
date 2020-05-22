import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addNewProduct, changeProduct, loadProductItem, updateProduct} from "redux/actions/productAction";
import {IStateInterface} from "redux/rootReducer";
import {
    addNewFactoryItem,
    changeFactoryItem,
    loadFactoryItem,
    updateFactoryItem
} from "redux/actions/factoryLineAction";


interface IFactoryLineProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const FactoryLineItem = (props: IFactoryLineProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const id = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;

    const factoryLineItem  = useSelector((state: IStateInterface)=> state.factoryLine.lineItem);
    // const isLoading = useSelector((state: any) => state.product.isLoading);
    // const errorValue = useSelector((state: any) => state.product.error);
    const hasError = useSelector((state: IStateInterface) => state.product.hasError)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...factoryLineItem, [event.target.name]: event.target.value};
        dispatch(changeFactoryItem(item))
    };

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.MouseEvent) => {
        if (id === 0) {
            console.log(factoryLineItem);
            dispatch(addNewFactoryItem(factoryLineItem));
        } else {
            dispatch(updateFactoryItem(factoryLineItem));
        }
        if (!hasError) history.push('/catalogs/lines');
    };

    useEffect( ()=> {
            dispatch(loadFactoryItem(id));
        }, [dispatch]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
                    <CardHeader
                        subheader=""
                        title="Линия производства"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Наименование"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={factoryLineItem.name}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={saveHandler}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/catalogs/lines'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default FactoryLineItem;
