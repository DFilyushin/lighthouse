import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Typography} from '@material-ui/core';
import { SearchInput } from '../../../../components';
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";

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
    }
}));

interface IContractToolbar {
    className: string,
    onFind: any,
    onDelete: any
}

const ContractToolbar = (props: IContractToolbar) => {
    const history = useHistory();
    const { className, onFind, onDelete, ...rest } = props;

    const classes = useStyles();

    function onKeyDownHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    function onNewClientHandler() {
        history.push('/client/new');
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
                <Button color="primary" variant="contained" onClick={onNewClientHandler}>Новый контракт</Button>
                <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
            </div>
            <div className={classes.row}>
                <SearchInput
                    className={classes.searchInput}
                    onEnterKeyDown={onKeyDownHandler}
                    placeholder="Поиск контракта"
                />
            </div>
        </div>
    );
};

ContractToolbar.propTypes = {
    className: PropTypes.string,
    onFind: PropTypes.func.isRequired
};

export default ContractToolbar;
