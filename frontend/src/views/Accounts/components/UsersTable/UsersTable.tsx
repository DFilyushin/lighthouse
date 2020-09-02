import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardActions,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    Button
} from '@material-ui/core';
import {IAccountListItem} from 'types/model/user';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import {rowsPerPageArray} from "../../../../utils/AppConst";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  tableRow: {

  },
  rowHeader: {
    fontWeight: 'bold'
  }

}));

interface IUsersTableProps{
  className: string;
  users: IAccountListItem[];
  onClickItem: any;
  onDeleteItem: any;
}



const UsersTable = (props: IUsersTableProps) => {
  const { className, users, onClickItem, onDeleteItem, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const cellClicked = (userId: string) => {
    onClickItem(userId);
  }

  const cellDeleteClicked = (userId: string) => {
    onDeleteItem(userId);
  };

  const handlePageChange = (event:any, page: number) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  function getAccountIcon(account: IAccountListItem) {
    if (account.isAdmin) {
      return <SupervisorAccountIcon color={"primary"} />
    }
    if (account.active) {
      return <PersonIcon />
    }
    else {
      return <PermIdentityIcon />
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.rowHeader}>Сотрудник</TableCell>
                  <TableCell className={classes.rowHeader}>Логин</TableCell>
                  <TableCell className={classes.rowHeader}>Email</TableCell>
                  <TableCell className={classes.rowHeader}>Зарегистрирован</TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.login}
                  >
                    <TableCell>
                      <div className={classes.nameContainer}>
                        {getAccountIcon(user)}
                        <Typography variant="body1">&nbsp;{user.lastName}&nbsp;{user.firstName}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.login}</TableCell>
                    <TableCell>
                      {user.email}
                    </TableCell>
                    <TableCell>{moment(user.joined).format('DD/MM/YYYY')}</TableCell>
                    <TableCell align="right">
                      <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={event => cellDeleteClicked(user.login)}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                          variant="outlined"
                          color="primary"
                          onClick={event => cellClicked(user.login)}
                      >
                        Открыть
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageArray}
          labelRowsPerPage={'Строк на странице'}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
        />
      </CardActions>
    </Card>
  );
};

export default UsersTable;
