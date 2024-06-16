import { set } from 'firebase/database';
import { createContext, useContext, useState, useEffect } from 'react';

import { decodeJWT } from '../../Functions/decodeJWT';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  const [account, setAccount] = useState(storedAccessToken ? decodeJWT(storedAccessToken) : null);
  const [token, setToken] = useState(storedAccessToken ? storedAccessToken : null);
  const [refreshToken, setRefreshToken] = useState(storedRefreshToken ? storedRefreshToken : null);

  const login = (account, token, refreshToken) => {
    setAccount(account);
    setToken(token);
    setRefreshToken(refreshToken)
  };

  const reNewToken = (token, refreshToken) => {
    setToken(token);
    setRefreshToken(refreshToken)
  };

  const logout = () => {
    // Xóa accessToken và refreshToken từ local storage khi logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccount(null);
    setToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ account, token, refreshToken, login, logout, reNewToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
