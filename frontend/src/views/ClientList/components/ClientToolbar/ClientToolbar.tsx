import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { SearchInput } from '../../../../components';
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

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
  }
}));

interface IClientToolbar {
  className: string,
  onFind: any,
  onDelete: any
}

const ClientToolbar = (props: IClientToolbar) => {
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
      <div className={classes.buttonGroup}>
        <span className={classes.spacer} />
        <Button color="primary" variant="contained" onClick={onNewClientHandler}>Новый клиент</Button>
        <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          onEnterKeyDown={onKeyDownHandler}
          placeholder="Поиск клиента"
        />
      </div>
    </div>
  );
};

ClientToolbar.propTypes = {
  className: PropTypes.string,
  onFind: PropTypes.func.isRequired
};

export default ClientToolbar;
