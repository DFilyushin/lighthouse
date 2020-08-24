import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    FormControl,
    MenuItem,
    Select,
    Typography,
    ListItem,
    ListItemAvatar,
    List,
    Grid,
    Avatar, Switch, FormControlLabel
} from '@material-ui/core';
import { SearchInput } from 'components';
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import { NO_SELECT_VALUE} from "utils/AppConst";
import {CONTRACT_STATE_ITEMS} from "types/model/contract";

const useStyles = makeStyles(theme => ({
    root: {},
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        margin: theme.spacing(0),
    },
    spacer: {
        flexGrow: 1
    },
    importButton: {
        marginRight: theme.spacing(1)
    },
    exportButton: {
        marginRight: theme.spacing(1)
    },
    searchInput: {
        marginRight: theme.spacing(1),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    white: {
        color: theme.palette.grey["100"],
        backgroundColor: theme.palette.background.default
    },
    formControl: {
        margin: theme.spacing(1),
    },
    formCheck: {
        paddingLeft: 2,
    },
    formControlWidth: {
        minWidth: 250
    }
}));

interface IContractToolbar {
    className: string,
    onFind: any,
    onNew: any,
    onDelete: any,
    onSetState: any,
    contractState: number,
    showOwnContract: boolean,
    handleChangeHidden: any
}

const ContractToolbar = (props: IContractToolbar) => {
    const { className, onFind, onNew, onDelete, onSetState, contractState, showOwnContract, handleChangeHidden, ...rest } = props;

    const classes = useStyles();

    function onKeyDownHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    const handleChangeState = (event: React.ChangeEvent<{value: unknown}>)=>{
        onSetState(event.target.value as number)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChangeHidden(event.target.checked);
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> <WorkOutlineOutlinedIcon color={"primary"}/> </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Контракты</Typography>
                </ListItem>
            </List>
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xs={12}
                >
                    <div className={classes.buttonGroup}>
                        <Button color="primary" variant="contained" onClick={onNew}>Новый контракт</Button>
                        <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
                    </div>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={3}
                className={classes.row}
            >
                <Grid
                    item
                    lg={3}
                    sm={6}
                    md={6}
                    xs={12}
                >
                    <SearchInput
                        className={classes.searchInput}
                        onEnterKeyDown={onKeyDownHandler}
                        placeholder="Поиск контракта"
                    />
                </Grid>
                <Grid
                    item
                    lg={2}
                    sm={6}
                    md={6}
                    xs={12}
                >
                    <FormControl className={clsx(classes.formControl)} >
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={contractState}
                            onChange={handleChangeState}
                        >
                            <MenuItem key={NO_SELECT_VALUE} value={NO_SELECT_VALUE}>
                                <em>не указано</em>
                            </MenuItem>
                            {
                                CONTRACT_STATE_ITEMS.map(item=>(
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>

                <Grid
                    item
                    lg={2}
                    sm={6}
                    md={6}
                    xs={12}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showOwnContract}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label="Мои контракты"
                        className={classes.formCheck}
                    />
                </Grid>

            </Grid>

        </div>
    );
};

export default ContractToolbar;
