import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LoadingButton } from '@mui/lab';
import { Box, Avatar, Typography, Grid, Link } from '@mui/material';
import { titleActions, useTitle } from 'context/title';
import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import FormTextField from 'components/forms/FormTextField';
import api from 'api';
import { useSnackbar } from 'notistack';

const registerFormSchema = yup
  .object({
    username: yup
      .string()
      .required('Username is required')
      .min(2, 'Username must have at least 2 characters')
      .max(50, 'Username cannot exceed 50 characters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Email should be valid'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must have at least 8 characters'),
    passwordConfirm: yup
      .string()
      .required('Password Confirmation is required')
      .oneOf(
        [yup.ref('password'), null],
        'Password confirmation must match the password',
      ),
  })
  .required();

const RegisterPage = () => {
  const { dispatch: titleDispatch } = useTitle();

  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(registerFormSchema),
  });

  useEffect(() => {
    titleActions.setTitle(titleDispatch, {
      pageTitle: 'Register',
      documentTitle: 'Register',
    });
  }, [titleDispatch]);

  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      const { email, password, username } = data;
      try {
        await api.users.createUser(email, username, password);
        enqueueSnackbar('User successfully created', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar],
  );

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormTextField
              control={control}
              name="email"
              type="email"
              placeholder="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              control={control}
              name="username"
              placeholder="Username"
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              control={control}
              name="password"
              type="password"
              placeholder="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              control={control}
              name="passwordConfirm"
              type="password"
              placeholder="Password Confirmation"
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
              fullWidth
            />
          </Grid>
        </Grid>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={isLoading}
        >
          Register
        </LoadingButton>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/login">
              Already have an account? Login
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RegisterPage;
