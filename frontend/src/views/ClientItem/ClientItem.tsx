import React, {useState, useEffect, SyntheticEvent} from 'react';
import moment from "moment";
import 'moment/locale/ru';
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
import {addNewClient, changeClientItem, loadClientItem, updateClient} from "redux/actions/clientAction";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";

interface IClientItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));


const ClientItem = (props: IClientItemProps) => {
    const paramId = props.match.params.id;
    const clientId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const clientItem = useSelector((state: IStateInterface) => state.client.clientItem);
    const hasError = useSelector((state: IStateInterface)=> state.client.hasError);



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...clientItem, [event.target.name]: event.target.value};
        dispatch(changeClientItem(item))
    };

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        if (clientId === 0) {
            await dispatch(addNewClient(clientItem));
        } else {
            await dispatch(updateClient(clientItem));
        }
        resolve();
    });


    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        event.preventDefault();
        saveItem(dispatch).then( ()=>{
                console.log('state', hasError);
                history.push('/clients/');
            }
        )
    };

    useEffect( ()=> {
        dispatch(loadClientItem(clientId));
    }, [dispatch]);

    return (
        <div className={classes.root}>
        <Card
            {...rest}
            className={className}
        >
            <form
                autoComplete="off"
                onSubmit={saveHandler}
            >
                <CardHeader
                    subheader=""
                    title="Клиент"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Наименование клиента"
                                margin="dense"
                                name="clientName"
                                onChange={handleChange}
                                required
                                value={clientItem.clientName}
                                variant="outlined"
                                id="IdClientName"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Адрес регистрации"
                                margin="dense"
                                name="clientAddr"
                                onChange={handleChange}
                                required
                                value={clientItem.clientAddr}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={8}
                            xs={8}
                        >
                            <TextField
                                fullWidth
                                label="Контактный сотрудник"
                                margin="dense"
                                name="clientEmployee"
                                onChange={handleChange}
                                value={clientItem.clientEmployee}
                                variant="outlined"
                                required={true}
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={4}
                        >
                            <TextField
                                fullWidth
                                label="Контактный телефон"
                                margin="dense"
                                name="contactPhone"
                                onChange={handleChange}
                                value={clientItem.contactPhone}
                                variant="outlined"
                                required={true}
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Факс"
                                margin="dense"
                                name="contactFax"
                                onChange={handleChange}
                                value={clientItem.contactFax}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Email"
                                margin="dense"
                                name="contactEmail"
                                onChange={handleChange}
                                value={clientItem.contactEmail}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="БИН"
                                margin="dense"
                                name="reqBin"
                                onChange={handleChange}
                                required
                                value={clientItem.reqBin}
                                variant="outlined"
                                inputProps={{'maxLength': 12}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="Лиц. счёт"
                                margin="dense"
                                name="reqAccount"
                                onChange={handleChange}
                                required
                                value={clientItem.reqAccount}
                                variant="outlined"
                                inputProps={{'maxLength': 20}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="БИК"
                                margin="dense"
                                name="reqBik"
                                onChange={handleChange}
                                required
                                value={clientItem.reqBik}
                                variant="outlined"
                                inputProps={{'maxLength': 8}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Банк"
                                margin="dense"
                                name="reqBank"
                                onChange={handleChange}
                                required
                                value={clientItem.reqBank}
                                variant="outlined"
                                inputProps={{'maxLength': 255}}
                            />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                        <TextField
                            fullWidth
                            id="outlined-multiline-flexible"
                            label="Дополнительно"
                            multiline
                            margin="dense"
                            rowsMax="5"
                            name="comment"
                            value={clientItem.comment}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid
                            item
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                disabled
                                name="created"
                                margin="dense"
                                id="filled-disabled"
                                label="Создан"
                                value={moment(clientItem.created).format('YYYY.MM.DD')}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={10}
                        >
                            <TextField
                                fullWidth
                                disabled
                                name="clientAgent"
                                margin="dense"
                                id="filled-disabled"
                                label="Агент"
                                value={clientItem.clientAgent}
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
                        type="submit"
                    >
                        Сохранить
                    </Button>
                    <Button
                        color="default"
                        variant="contained"
                        onClick={(event => history.push('/clients'))}
                    >
                        Отменить
                    </Button>
                </CardActions>
            </form>
        </Card>
        </div>
    );
};

export default ClientItem;
