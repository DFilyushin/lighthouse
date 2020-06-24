import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';
import { getInitials } from 'helpers';
import {IAccountListItem, IUserData} from 'types/model/user';
import Button from "@material-ui/core/Button";

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
};



const UsersTable = (props: IUsersTableProps) => {
  const { className, users, onClickItem, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState<string[]> ([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement> ) => {
    const { users } = props;

    let selectedUsers:string [] = [];

    if (event.target.checked) {
      selectedUsers = users.map(user => user.login);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const cellClicked = (userId: string) => {
    onClickItem(userId);
  };

  const handleSelectOne = (event:React.ChangeEvent<HTMLInputElement>, id:string) => {
    // const selectedIndex = selectedUsers.indexOf(id);
    // let newSelectedUsers: IUserData[] = [];
    //
    // if (selectedIndex === -1) {
    //   newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    // } else if (selectedIndex === 0) {
    //   newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    // } else if (selectedIndex === selectedUsers.length - 1) {
    //   newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelectedUsers = newSelectedUsers.concat(
    //     selectedUsers.slice(0, selectedIndex),
    //     selectedUsers.slice(selectedIndex + 1)
    //   );
    // }
    //
    // setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event:any, page: number) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

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
                  <TableCell>Логин</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Зарегистрирован</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(0, rowsPerPage).map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.login}
                    selected={selectedUsers.indexOf(user.login) !== -1}
                  >
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Typography variant="body1">{user.lastName}&nbsp;{user.firstName}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.login}</TableCell>
                    <TableCell>
                      {user.email}
                    </TableCell>
                    <TableCell>{moment(user.joined).format('DD/MM/YYYY')}</TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" color="primary" onClick={event => cellClicked(user.login)}>Открыть</Button>
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
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

export default UsersTable;
