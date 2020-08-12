import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    ListItem,
    ListItemAvatar,
    List,
    Avatar
} from '@material-ui/core';
import { SearchInput } from 'components';
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import {NO_SELECT_VALUE} from "utils/AppConst";
import {CONTRACT_STATE_ITEMS} from "types/model/contract";

const useStyles = makeStyles(theme => ({
    root: {},
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    row: {
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        margin: theme.spacing(1),
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
        marginRight: theme.spacing(1)
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
    contractState: number
}

const ContractToolbar = (props: IContractToolbar) => {
    const { className, onFind, onNew, onDelete, onSetState, contractState, ...rest } = props;

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
            <div className={classes.buttonGroup}>
                <span className={classes.spacer} />
                <Button color="primary" variant="contained" onClick={onNew}>Новый контракт</Button>
                <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
            </div>
            <div className={classes.row}>
                <SearchInput
                    className={classes.searchInput}
                    onEnterKeyDown={onKeyDownHandler}
                    placeholder="Поиск контракта"
                />
                <FormControl className={clsx(classes.formControl, classes.formControlWidth)} >
                    <InputLabel id="demo-simple-select-helper-label">Состояние контракта</InputLabel>
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
            </div>
        </div>
    );
};

export default ContractToolbar;
