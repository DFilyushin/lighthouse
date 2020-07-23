import React, {useEffect, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField,
    Paper,
    Typography
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import moment from "moment";

interface IStoreNewItemsProps {
    className: string;
    match: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    dividerInset: {
        margin: `5px 0 0 ${theme.spacing(9)}px`,
    },
}));

const StoreNewItems = (props: IStoreNewItemsProps) => {
    const { className, ...rest } = props;

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    // useEffect(()=> {
    //     dispatch(loadStoreItem(id));
    // }, [dispatch, id]);


    return (
        <div className={classes.root}>
            <Card
                {...rest}
                className={className}
            >
                <CardHeader
                    subheader={'Приход сырья'}
                    title="Добавление материалов на склад"
                />
                <CardContent>
                    <Paper className={classes.paper_bar}>
                    </Paper>
                    <form
                        autoComplete="off"
                        noValidate
                    >
                        <Divider />
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Button
                                color="default"
                                variant="contained"
                                onClick={(event => history.push('/store/journal/'))}
                            >
                                Закрыть
                            </Button>
                        </CardActions>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StoreNewItems;
