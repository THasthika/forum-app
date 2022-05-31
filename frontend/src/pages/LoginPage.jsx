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
import { useUser } from 'context/user';
import { setUserData } from 'context/user/actions';

const loginFormSchema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .email('Email must be valid'),
    password: yup.string().required('Password is required'),
  })
  .required();

const LoginPage = () => {
  const { user, dispatch: userDispatch } = useUser();

  const { dispatch: titleDispatch } = useTitle();

  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    email: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(loginFormSchema),
  });

  useEffect(() => {
    titleActions.setTitle(titleDispatch, {
      pageTitle: 'Login',
      documentTitle: 'Login',
    });
  }, [titleDispatch]);

  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      const { password, email } = data;
      try {
        const res = await api.auth.login(email, password);
        const data = res.data;
        setUserData(userDispatch, data);
        enqueueSnackbar('Login successful', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar, userDispatch],
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
        Login
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
        </Grid>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={isLoading}
        >
          Login
        </LoadingButton>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/register">
              Don't have an account? Register
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginPage;
