import React, { useRef } from 'react';

import { UserProvider } from 'context/user';
import { Route, Routes } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import { ThemeProvider } from 'context/theme';
import { SnackbarProvider } from 'notistack';
import { Button, CssBaseline } from '@mui/material';
import { TitleProvider } from 'context/title';
import Layout from 'Layout';
import RegisterPage from 'pages/RegisterPage';

function RoutesHolder() {
  // const user = useUser();

  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
    </Routes>
  );
}

function App() {
  const notistackRef = useRef();
  const onClickDismiss = (key) => () => {
    if (!notistackRef.current) {
      return;
    }
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
            <Button
              size="small"
              variant="inherit"
              onClick={onClickDismiss(key)}
            >
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
