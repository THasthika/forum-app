import React, { useContext, useEffect, useReducer } from 'react';
import { userReducer } from './reducer';

const { createContext } = require('react');

const initialState = null;

const initializer = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : initialState;

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, initializer);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
