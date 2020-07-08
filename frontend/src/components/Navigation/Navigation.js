/* eslint-disable react/no-multi-comp */
import React from 'react';
import { matchPath } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { List, Typography } from '@material-ui/core';

import useRouter from 'utils/useRouter';
import { NavigationListItem } from './components';
import {AccessGroups} from "../../utils/AppConst";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(3)
  }
}));

const NavigationList = props => {
  const { pages, groups, ...rest } = props;

  return (
    <List>
      {pages.reduce(
        (items, page) => reduceChildRoutes({ items, page, groups, ...rest }),
        []
      )}
    </List>
  );
};

NavigationList.propTypes = {
  depth: PropTypes.number,
  pages: PropTypes.array,
  groups: PropTypes.array
};

const reduceChildRoutes = props => {
  const { router, items, page, depth, groups } = props;

  // отсутствие свойства access говорит о том, что наследуется верхний уровень прав
  const isAllAccess = !page.hasOwnProperty('access') || page.access.includes(AccessGroups.ALL) || page.access.length === 0
  const isMenuIntersectGroups = !page.hasOwnProperty('access') || !!page.access.filter( (item) => groups.includes(item)).length;
  const isAccess = isAllAccess || isMenuIntersectGroups

  if (!isAccess) { return items }

  if (page.children) {
    const open = matchPath(router.location.pathname, {
      path: page.href,
      exact: false
    });

    items.push(
      <NavigationListItem
        depth={depth}
        icon={page.icon}
        key={page.title}
        label={page.label}
        open={Boolean(open)}
        title={page.title}
      >
        <NavigationList
          depth={depth + 1}
          pages={page.children}
          router={router}
        />
      </NavigationListItem>
    );
  } else {
    items.push(
      <NavigationListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={page.title}
        label={page.label}
        title={page.title}
      />
    );
  }

  return items;
};

const Navigation = props => {
  const { title, pages, className, component: Component, groups, ...rest } = props;

  const classes = useStyles();
  const router = useRouter();

  return (
    <Component
      {...rest}
      className={clsx(classes.root, className)}
    >
      {
        title &&
        <Typography variant="overline">{title}</Typography>
      }
      <NavigationList
        depth={0}
        pages={pages}
        router={router}
        groups={groups}
      />
    </Component>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
  component: PropTypes.any,
  pages: PropTypes.array.isRequired,
  title: PropTypes.string,
  groups: PropTypes.array.isRequired
};

Navigation.defaultProps = {
  component: 'nav'
};

export default Navigation;
