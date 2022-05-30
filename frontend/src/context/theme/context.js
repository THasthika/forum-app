import React, { useContext, useEffect, useMemo, useReducer } from 'react';

import { ThemeProvider as MaterialThemeProvider } from '@mui/material';

import { modeReducer } from './reducer';
import { createTheme } from '@mui/material/styles';

const { createContext } = require('react');

const initialState = 'light';

const initializer = localStorage.getItem('theme')
  ? JSON.parse(localStorage.getItem('theme'))
  : initialState;

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, dispatch] = useReducer(modeReducer, initializer);

  // Persist state on each update
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(mode));
  }, [mode]);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, dispatch }}>
      <MaterialThemeProvider theme={theme}>{children}</MaterialThemeProvider>
    </ThemeContext.Provider>
  );
};
