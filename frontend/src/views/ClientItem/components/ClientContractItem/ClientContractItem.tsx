import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, TextField} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import {ContractStateString, IContractListItem} from "types/model/contract";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import {NumberFormatCustom} from 'components'

const useStyles = makeStyles(theme => ({
    root: {
        //padding: theme.spacing(1)
    },
    content: {
        paddingTop: 150,
        textAlign: 'center'
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 560
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        //maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}));

interface IClientContractItemProps {
    item: IContractListItem;
    onClickItem: ( (id: number)=> void);
}

function getContractStateStr(status: number): string {
    return ContractStateString[status];
}

const ClientContractItem = (props: IClientContractItemProps) => {
    const classes = useStyles();
    const { item, onClickItem} = props;

    const cellClicked = (id: number) => {
        onClickItem(id);
    };

    return (
        <Fragment>
            <Grid item xs={2}>
                <Paper component="form" elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        margin="dense"
                        label="Номер контракта"
                        name="num"
                        value={item.num}
                    />
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Статус"
                    name="status"
                    value={getContractStateStr(item.status)}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    label="Сумма, тенге"
                    name="sum"
                    margin="dense"
                    value={item.sum}
                    InputProps={{
                        inputComponent: NumberFormatCustom as any,
                    }}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Заключён"
                    name="contractDate"
                    value={item.contractDate}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Доставка на..."
                    name="estDelivery"
                    value={item.estDelivery}
                />
            </Grid>
            <Grid item>
                <Tooltip title={'Открыть контракт'}>
                    <Button variant="outlined" color="primary" onClick={event => cellClicked(item.id)}>Открыть</Button>
                </Tooltip>
            </Grid>
        </Fragment>
    );
};

export default ClientContractItem;
