import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { SearchInput } from '../../../../components';

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

const EmployeesToolbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.buttonGroup}>
        <span className={classes.spacer} />
        <Button color="primary" variant="contained">Новый сотрудник</Button>
        <Button color="secondary" variant="contained">Удалить</Button>
      </div>
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Поиск сотрудника"
        />
      </div>
    </div>
  );
};

EmployeesToolbar.propTypes = {
  className: PropTypes.string
};

export default EmployeesToolbar;
