import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
    Avatar,
    Button,
    FormControlLabel,
    List,
    ListItem,
    ListItemAvatar,
    Switch,
    Typography
} from '@material-ui/core';
import {SearchInput} from 'components';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';


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

const EmployeesToolbar = props => {
    const {className, showFired, handleChangeFired, onDelete, onFind, onNew, ...rest} = props;

    const classes = useStyles();

    function onKeyDownHandler(event) {
        if (event.key === 'Enter') {
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
                        <Avatar className={clsx(classes.large, classes.white)}>
                            <PeopleAltIcon color={"primary"}/>
                        </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Сотрудники предприятия</Typography>
                </ListItem>
            </List>

            <div className={classes.buttonGroup}>
                <Button color="primary" variant="contained" onClick={onNew}>Новый сотрудник</Button>
                <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
            </div>


            <div className={classes.row}>

                <SearchInput
                    className={classes.searchInput}
                    onEnterKeyDown={onKeyDownHandler}
                    placeholder="Поиск сотрудника"
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={showFired}
                            onChange={handleChangeFired}
                            color="primary"
                        />
                    }
                    label="Показывать уволенных"
                    className={classes.formCheck}
                />
            </div>
        </div>
    );
};

EmployeesToolbar.propTypes = {
    className: PropTypes.string,
    showFired: PropTypes.bool,
    handleChangeFired: PropTypes.func,
    onDelete: PropTypes.func,
    onNew: PropTypes.func,
    onFind: PropTypes.func
};

export default EmployeesToolbar;
