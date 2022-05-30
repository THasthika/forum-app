import React from 'react';
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

  function handleLogout() {
    // clear cart and user
    userActions.logoutUser(userDispatch);

    enqueueSnackbar('Logged Out Successfully!', {
      variant: 'success',
    });

    navigate('/');
  }

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
            <>
              <Button component={Link} to="/profile" color="inherit">
                {user.name}
              </Button>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
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
