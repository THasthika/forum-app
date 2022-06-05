import { Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import api from 'api';
import { useUser } from 'context/user';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';

const ProfilePage = () => {
  const { user } = useUser();

  const { enqueueSnackbar } = useSnackbar();

  const [userData, setUserData] = useState({ data: null, loading: false });

  const loadUserData = useCallback(async () => {
    const { id } = user;
    setUserData((state) => ({ ...state, loading: true }));
    try {
      const userData = await api.users.getUserById(id);
      setUserData((state) => ({ ...state, data: userData.data }));
    } catch (err) {
      setUserData((state) => ({ ...state, data: null }));
    } finally {
      setUserData((state) => ({ ...state, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <Box>
      <Box mt={2}>
        {!!userData.data && !userData.loading && (
          <>
            <Typography>Username: {userData.data.username}</Typography>
            <Typography>Email: {userData.data.email}</Typography>
          </>
        )}
        {userData.loading && <Skeleton />}
      </Box>
    </Box>
  );
};

export default ProfilePage;
