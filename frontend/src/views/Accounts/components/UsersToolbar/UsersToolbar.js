import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {Button, Divider, Typography, Grid} from '@material-ui/core';
import {Page, SearchInput} from "../../../../components";

//import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
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

const UsersToolbar = props => {
  const { className, onFindHandler, ...rest } = props;

  const classes = useStyles();

  function onKeyDownHandler (event) {
    if(event.key === 'Enter'){
      const findText = event.currentTarget.value.trim();
      console.log(findText);
      onFindHandler(findText);
    }
  }

  return (
      <Page
          className={classes.root}
          title="Customer Management List"
      >
      <Grid
          alignItems="flex-end"
          container
          justify="space-between"
          spacing={3}
      >
        <Grid item>
          <Typography
              component="h2"
              gutterBottom
              variant="overline"
          >
            Администрирование
          </Typography>
          <Typography
              component="h1"
              variant="h5"
          >
            Список пользователей
          </Typography>
        </Grid>
        <Grid item>
          <Button
              color="primary"
              variant="contained"
          >
            Новый пользователь
          </Button>
        </Grid>

      </Grid>
      </Page>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  onFindHandler: PropTypes.func
};

export default UsersToolbar;
