import React, { useRef } from 'react';

import { UserProvider, useUser } from 'context/user';
import { Route, Routes } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import { ThemeProvider } from 'context/theme';
import { SnackbarProvider } from 'notistack';
import { Button, CssBaseline } from '@mui/material';
import { TitleProvider } from 'context/title';
import Layout from 'Layout';
import RegisterPage from 'pages/RegisterPage';
import LoginPage from 'pages/LoginPage';
import UsersListPage from 'pages/users/UsersListPage';
import PostsListPage from 'pages/posts/PostsListPage';
import PostPage from 'pages/posts/PostPage';
import ProfilePage from 'pages/ProfilePage';
import UserPage from 'pages/users/UserPage';

function RoutesHolder() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      {!!user ? (
        <>
          <Route path="/users" element={<UsersListPage />}></Route>
          <Route path="/users/:id" element={<UserPage />}></Route>
          <Route path="/posts" element={<PostsListPage />}></Route>
          <Route path="/posts/:id" element={<PostPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
        </>
      ) : (
        <>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
        </>
      )}
    </Routes>
  );
}

function App() {
  const notistackRef = useRef();
  const onClickDismiss = (key) => () => {
    if (!notistackRef.current) {
      return;
    }
    // @ts-ignore
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <div className="App">
      <ThemeProvider>
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          maxSnack={3}
          preventDuplicate
          ref={notistackRef}
          action={(key) => (
            <Button size="small" color="inherit" onClick={onClickDismiss(key)}>
              Dismiss
            </Button>
          )}
        >
          <UserProvider>
            <TitleProvider>
              <CssBaseline />
              <Layout>
                <RoutesHolder />
              </Layout>
            </TitleProvider>
          </UserProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
