import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Typography,
  Skeleton,
  DialogActions,
  Button,
} from '@mui/material';
import api from 'api';
import { useSnackbar } from 'notistack';
import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormCheckboxes from './forms/FormCheckboxes';
import FormTextField from './forms/FormTextField';

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

export default UserEditDialog;
