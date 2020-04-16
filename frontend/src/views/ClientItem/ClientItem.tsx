import React, { useState, useEffect } from 'react';
import moment from "moment";
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
import axios from "axios";
import ClientEndpoint from "services/endpoints/clients";
import {IClientItem} from "IInterfaces";
import { useHistory } from "react-router-dom";

interface IClientItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const nullClient = {
    id: 0,
    created: '',
    clientName: '',
    clientAgent: '',
    clientAddr: '',
    clientEmployee: '',
    contactPhone: '',
    contactEmail: '',
    contactFax: '',
    reqBin: '',
    reqAccount: '',
    reqBank: '',
    reqBik: '',
    comment: '',
    clientId: '8888',
    agentId: 1
};

const ClientItem = (props: IClientItemProps) => {
    const paramId = props.match.params.id;
    const clientId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;
    const history = useHistory();
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(true);
    const [client, setClient] = useState <IClientItem>(nullClient);

    /**
     * Загрузить клиента
     * @param clientId
     */
    async function loadClientItem (clientId: number){
        setIsLoading(true);
        if (clientId === 0) return null
        const response = await axios.get(ClientEndpoint.getClient(clientId));
        const data = await response.data;
        setClient(data);

        setIsLoading(false);
    };


    async function saveNewClient() {
        const saveUrl = ClientEndpoint.newClient();
        console.log(saveUrl);
        console.log(JSON.stringify(client));
        try{
            const response = await axios.post(saveUrl, client);
            if (response.status === 201){
                history.push('/clients')
            }else{
                console.log(response.statusText)
            }
        }
        catch (e) {
            console.log(e.message)
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClient({
            ...client,
            [event.target.name]: event.target.value
        });
    };

    const saveHandler = (event: React.MouseEvent) => {
        if (clientId === 0) saveNewClient();
    };

    useEffect( ()=> {
        console.log(clientId);
        loadClientItem(clientId);
    }, []);

    return (
        <div className={classes.root}>
        <Card
            {...rest}
            className={className}
        >
            <form
                autoComplete="off"
                noValidate
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
                                value={client.clientName}
                                variant="outlined"
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
                                value={client.clientAddr}
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
                                value={client.clientEmployee}
                                variant="outlined"
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
                                value={client.contactPhone}
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
                                label="Факс"
                                margin="dense"
                                name="contactFax"
                                onChange={handleChange}
                                value={client.contactFax}
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
                                value={client.contactEmail}
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
                                value={client.reqBin}
                                variant="outlined"
                                inputProps={{'maxlength': 12}}
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
                                value={client.reqAccount}
                                variant="outlined"
                                inputProps={{'maxlength': 20}}
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
                                value={client.reqBik}
                                variant="outlined"
                                inputProps={{'maxlength': 8}}
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
                                value={client.reqBank}
                                variant="outlined"
                                inputProps={{'maxlength': 255}}
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
                            value={client.comment}
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
                                value={moment(client.created).format('YYYY.MM.DD')}
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
                                value={client.clientAgent}
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
                        color="secondary"
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
