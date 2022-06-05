import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import api from '../../api';
import { titleActions, useTitle } from 'context/title';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'utils/useDebounce';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { format } from 'date-fns';
import { DATE_FORMAT } from 'utils/constants';
import { Delete, Edit, Search } from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { useSnackbar } from 'notistack';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import FormTextField from 'components/forms/FormTextField';
import FormCheckboxes from 'components/forms/FormCheckboxes';

const UsersTable = ({
  columns,
  users,
  actions,
  page = 0,
  totalCount = 0,
  defaultSort = [null, null],
  noSearch = false,
  rowsPerPageList = [5, 10, 15, 20, 25, 30],
  searchBy = [],
  onNext = () => {},
  onPrev = () => {},
  onSearch = (searchText, searchBy, sort, rowsPerPage) => {},
}) => {
  const [sort, setSort] = useState(defaultSort);
  const [searchText, setSearchText] = useState('');
  const [searchSubmitText, setSearchSubmitText] = useState(searchText);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageList[0]);

  const nextSortState = (sort) => {
    switch (sort) {
      case 'asc':
        return 'desc';
      case 'desc':
        return null;
      default:
        return 'asc';
    }
  };

  const searchSubmit = useDebouncedCallback(() => {
    const sortKey = sort[0];
    let sortDir = sort[1];
    if (sortKey !== null && sortDir !== null) {
      sortDir = sortDir.toUpperCase();
    }
    onSearch(searchSubmitText, searchBy, [sortKey, sortDir], rowsPerPage);
  }, 300);

  const onSortToggle = useCallback(
    (name) => {
      let dir = null;
      if (sort[0] === name) {
        // toggle desc to asc or asc to desc
        dir = sort[1];
      }
      dir = nextSortState(dir);
      if (dir === null) {
        name = null;
      }
      setSort([name, dir]);
    },
    [sort],
  );

  const onPageChange = useCallback(
    (e, newPage) => {
      if (newPage > page) {
        onNext();
      } else {
        onPrev();
      }
    },
    [onNext, onPrev, page],
  );

  const onRowsPerPageChange = useCallback((e, data) => {
    const newRowsPerPage = data.props.value || 5;
    setRowsPerPage(newRowsPerPage);
  }, []);

  const onSearchTextSubmit = useCallback(() => {
    setSearchSubmitText(searchText);
  }, [searchText]);

  useEffect(() => {
    searchSubmit();
  }, [sort, rowsPerPage, searchSubmitText, searchSubmit]);

  return (
    <Box>
      {!noSearch && (
        <Box textAlign="right" mb={1}>
          <FormControl>
            <Input
              id="users-table-search"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyUp={(e) => {
                if (e.code === 'Enter') {
                  onSearchTextSubmit();
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTextSubmit}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Actions</TableCell>
            {columns.map((column) => (
              <TableCell key={column.name}>
                {column.sortable ? (
                  <TableSortLabel
                    active={column.name === sort[0]}
                    direction={column.name === sort[0] ? sort[1] : 'asc'}
                    onClick={() => onSortToggle(column.name)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {actions.map((action, i) => (
                  <IconButton
                    key={i}
                    onClick={() => action.onClick(user)}
                    title={action.label}
                  >
                    {action.icon}
                  </IconButton>
                ))}
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.name}>
                  {column.render
                    ? column.render(user[column.name])
                    : user[column.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              page={page}
              count={totalCount}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageList}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Box>
  );
};

const UserEditDialog = ({ user, open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const { handleSubmit, reset, control } = useForm({});

  const loadUserDetails = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        const resp = await api.users.getUserById(userId);
        reset(resp.data);
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar, reset],
  );

  const loadRoles = useCallback(async () => {
    try {
      const resp = await api.roles.getAllRoles();
      setRoles(resp.data);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    loadUserDetails(userId);
  }, [loadUserDetails, user]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const updateRole = useCallback(async ({ id, role, op }) => {
    if (op === 'remove') {
      await api.users.removeRole(id, role.name);
    } else if (op === 'add') {
      await api.users.addRole(id, role.name);
    }
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        setSubmitLoading(true);
        const { roles: userRoles, id, ...userData } = data;
        await api.users.updateUser(id, {
          username: userData.username,
          email: userData.email,
        });
        const roleOperations = [];
        const userRoleNames = userRoles.map((v) => v.name);
        roles.forEach((role) => {
          roleOperations.push({
            id,
            role,
            op: userRoleNames.indexOf(role.name) === -1 ? 'remove' : 'add',
          });
        });
        await Promise.all(roleOperations.map((o) => updateRole(o)));
        enqueueSnackbar('User Successfully Updated', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      } finally {
        setSubmitLoading(false);
      }
    },
    [enqueueSnackbar, roles, updateRole],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit, () => {
          console.log('OK!');
        })}
      >
        <DialogTitle>Edit User ({!!user && user.username})</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            {!loading && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormTextField
                    fullWidth
                    size="small"
                    control={control}
                    name="username"
                    label="Username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    fullWidth
                    size="small"
                    control={control}
                    name="email"
                    label="Email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">Roles</Typography>
                  <FormCheckboxes
                    name="roles"
                    control={control}
                    valueName="name"
                    labelName="displayName"
                    options={roles}
                  />
                </Grid>
              </Grid>
            )}
            {loading && <Skeleton />}
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            disabled={loading}
            loading={submitLoading}
            color="primary"
            type="submit"
          >
            Save
          </LoadingButton>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const UsersListPage = () => {
  const { dispatch: titleDispatch } = useTitle();

  const { enqueueSnackbar } = useSnackbar();

  const [userState, setUserState] = useState({
    users: [],
    links: {},
    meta: {},
  });

  const [deleteDialogState, setDeleteDialogState] = useState({
    data: null,
    open: false,
  });

  const [editDialogState, setEditDialogState] = useState({
    data: null,
    open: false,
  });

  const [loading, setLoading] = useState(false);

  const columns = [
    { name: 'username', label: 'Username', sortable: true, searchable: true },
    { name: 'email', label: 'Email', sortable: true, searchable: true },
    {
      name: 'isBanned',
      label: 'Banned',
      sortable: false,
      searchable: false,
      render: (v) => (v ? 'TRUE' : 'FALSE'),
    },
    {
      name: 'isVerified',
      label: 'Verified',
      sortable: false,
      searchable: false,
      render: (v) => (v ? 'TRUE' : 'FALSE'),
    },
    {
      name: 'createdAt',
      label: 'Created At',
      sortable: true,
      defaultSort: true,
      searchable: false,
      render: (v) => format(new Date(v), DATE_FORMAT),
    },
    {
      name: 'updatedAt',
      label: 'Updated At',
      sortable: true,
      defaultSort: true,
      searchable: false,
      render: (v) => format(new Date(v), DATE_FORMAT),
    },
  ];

  const actions = [
    {
      icon: <Edit />,
      label: 'Edit User',
      onClick: (user) => {
        setEditDialogState({ data: user, open: true });
      },
    },
    {
      icon: <Delete />,
      label: 'Delete User',
      onClick: (user) => {
        setDeleteDialogState({ data: user, open: true });
      },
    },
  ];

  useEffect(() => {
    titleActions.setTitle(titleDispatch, {
      pageTitle: 'Users',
      documentTitle: 'Users',
    });
  }, [titleDispatch]);

  const loadUsers = useCallback(
    async (
      page = 1,
      search = '',
      limit = 5,
      searchBy = ['username'],
      sort = [null, null],
    ) => {
      const resp = await api.users.searchUsers({
        page,
        search,
        searchBy,
        limit,
        sortBy: sort,
      });
      setUserState({
        users: resp.data.data,
        links: resp.data.links,
        meta: resp.data.meta,
      });
    },
    [],
  );

  const loadUsersLink = useCallback(
    async (type) => {
      const link = userState.links[type];
      if (!type) {
        console.log('link not found!');
        return;
      }
      const resp = await api.call(link);
      setUserState({
        users: resp.data.data,
        links: resp.data.links,
        meta: resp.data.meta,
      });
    },
    [userState.links],
  );

  const onSearch = useCallback(
    (searchText, searchBy, sort, rowsPerPage) => {
      loadUsers(1, searchText, rowsPerPage, searchBy, sort);
    },
    [loadUsers],
  );

  const onDeleteUser = useCallback(
    async (user) => {
      if (!user) return;
      try {
        await api.users.deleteUser(user.id);
        enqueueSnackbar('Successully deleted user', { variant: 'success' });
        loadUsers();
        setDeleteDialogState({ data: null, open: false });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    },
    [enqueueSnackbar, loadUsers],
  );

  // useEffect(() => {
  //   loadUsers();
  // }, [loadUsers]);

  return (
    <Box mt={2}>
      <DeleteConfirmationDialog
        data={deleteDialogState.data}
        open={deleteDialogState.open}
        onClose={() => setDeleteDialogState({ data: null, open: false })}
        onConfirm={onDeleteUser}
        messageFunc={(v) =>
          !!v ? `Do you really want to delete user (${v.username})` : ''
        }
      />
      {userState.users.length > 0 && (
        <UserEditDialog
          user={editDialogState.data}
          open={editDialogState.open}
          onClose={() => {
            setEditDialogState({ data: null, open: false });
          }}
        />
      )}
      <UsersTable
        columns={columns}
        users={userState.users}
        actions={actions}
        searchBy={['username', 'email']}
        onNext={() => loadUsersLink('next')}
        onPrev={() => loadUsersLink('previous')}
        onSearch={onSearch}
        totalCount={userState.meta.totalItems || 0}
        page={userState.meta.currentPage - 1 || 0}
      ></UsersTable>
    </Box>
  );
};

export default UsersListPage;
