import { Box } from '@mui/material';
import api from '../../api';
import { titleActions, useTitle } from 'context/title';
import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DATE_FORMAT } from 'utils/constants';
import { Delete, Edit } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import UserEditDialog from 'components/UserEditDialog';
import DataTable from 'components/DataTable';

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
      <DataTable
        columns={columns}
        data={userState.users}
        actions={actions}
        searchBy={['username', 'email']}
        onNext={() => loadUsersLink('next')}
        onPrev={() => loadUsersLink('previous')}
        onSearch={onSearch}
        totalCount={userState.meta.totalItems || 0}
        page={userState.meta.currentPage - 1 || 0}
      />
    </Box>
  );
};

export default UsersListPage;
