import React, { useContext, useReducer, useEffect } from 'react';
import { titleReducer } from './reducer';

const { createContext } = require('react');

const initialState = {
  pageTitle: 'Forum',
  documentTitle: 'Forum',
};

const TitleContext = createContext(null);

export const useTitle = () => useContext(TitleContext);

export const TitleProvider = ({ children }) => {
  const [title, dispatch] = useReducer(titleReducer, initialState);

  useEffect(() => {
    document.title = title.documentTitle;
  }, [title]);

  return (
    <TitleContext.Provider value={{ title, dispatch }}>
      {children}
    </TitleContext.Provider>
  );
};
