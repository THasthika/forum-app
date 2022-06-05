import React, { useContext, useEffect, useReducer } from 'react';
import { getUser, setUser } from 'utils/localStorage';
import { userReducer } from './reducer';

const { createContext } = require('react');

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, getUser());

  useEffect(() => {
    setUser(user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
