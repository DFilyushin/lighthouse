import React, {Fragment} from 'react';
import {Grid, TextField, Paper, IconButton, Fab, makeStyles} from '@material-ui/core';
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import DeleteIcon from '@material-ui/icons/Delete';
import {IEmployeeListItem} from "../../../../types/model/employee";

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

interface IMemberItemProps {
    item: IEmployeeListItem;
    onDeleteItem: ((id: number) => void);
    onChangeItem: ((id: number) => void);
}


const MemberItem = (props: IMemberItemProps) => {
    const classes = useStyles();
    const {item, onDeleteItem, onChangeItem} = props;

    return (
        <Fragment>
            <Grid item xs={11}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Сотрудник"
                        margin="dense"
                        name="unit"
                        value={item.fio}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                onClick={event => {
                                    onChangeItem(item.id)
                                }}>
                        <MenuOpenIcon/>
                    </IconButton>
                </Paper>
            </Grid>
            <Grid item xs={1}>
                <Fab color="secondary" aria-label="add" onClick={event => onDeleteItem(item.id)}>
                    <DeleteIcon/>
                </Fab>
            </Grid>
        </Fragment>
    );
};

export default MemberItem;
