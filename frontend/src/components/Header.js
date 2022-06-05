import React, { useCallback, useMemo } from 'react';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { themeActions, useTheme } from '../context/theme';
import { useTitle } from '../context/title';
import { Link, useNavigate } from 'react-router-dom';
import { userActions, useUser } from 'context/user';
import { useSnackbar } from 'notistack';

const Header = () => {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { user, dispatch: userDispatch } = useUser();

  const { title } = useTitle();

  const { theme, dispatch: themeDispatch } = useTheme();

  const handleLogout = useCallback(() => {
    // clear cart and user
    userActions.logoutUser(userDispatch);

    enqueueSnackbar('Logged Out Successfully!', {
      variant: 'success',
    });

    navigate('/');
  }, [enqueueSnackbar, navigate, userDispatch]);

  const loggedLinkList = useMemo(
    () => [
      { title: 'Posts', to: '/posts' },
      { title: 'Users', to: '/users' },
      { title: 'Profile', to: '/profile' },
      { title: 'Logout', onClick: handleLogout },
    ],
    [handleLogout],
  );

  return (
    <AppBar position="fixed">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title.pageTitle}
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          {!!user ? (
            loggedLinkList.map((l, i) => {
              if (l.to) {
                return (
                  <Button key={i} component={Link} to={l.to} color="inherit">
                    {l.title}
                  </Button>
                );
              } else if (l.onClick) {
                return (
                  <Button key={i} onClick={l.onClick} color="inherit">
                    {l.title}
                  </Button>
                );
              } else {
                return <React.Fragment key={i}></React.Fragment>;
              }
            })
          ) : (
            <>
              <Button component={Link} to="/register" color="inherit">
                Register
              </Button>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
            </>
          )}
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => themeActions.toggleTheme(themeDispatch)}
          >
            {theme === 'light' ? <BrightnessLowIcon /> : <BrightnessHighIcon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
