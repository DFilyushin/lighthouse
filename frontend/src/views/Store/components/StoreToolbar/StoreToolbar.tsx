import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { SearchInput } from 'components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

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
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
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

interface IStoreToolbar {
    className: string,
    title: string,
    onFind?: any,
    icon?: any,
    onFindCaption?: string
}

const StoreToolbar = (props: IStoreToolbar) => {
    const { className, title, onFind, onFindCaption, ...rest } = props;
    const classes = useStyles();

    function onKeyDownHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> {rest.icon} </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">{title}</Typography>
                </ListItem>
            </List>

            {onFind &&
                <div className={classes.row}>
                    <SearchInput
                        className={classes.searchInput}
                        onEnterKeyDown={onKeyDownHandler}
                        placeholder={onFindCaption}
                    />
                </div>
            }
        </div>
    );
};

export default StoreToolbar;
