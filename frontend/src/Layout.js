import React from 'react';

import { Toolbar, Box, Container } from '@mui/material';
import Header from './components/Header';

const Layout = ({ children }) => {
  return (
    <Box>
      <Header></Header>
      <Container>
        <Toolbar />
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
