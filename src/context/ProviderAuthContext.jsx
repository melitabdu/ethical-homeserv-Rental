import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const ProviderAuthContext = createContext();

export const ProviderAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('providerToken') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ _id: decoded.id, ...decoded }); // adjust based on your JWT payload structure
      } catch (error) {
        console.error('Invalid token:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('providerToken');
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const loginProvider = (newToken) => {
    localStorage.setItem('providerToken', newToken);
    setToken(newToken);
  };

  const logoutProvider = () => {
    localStorage.removeItem('providerToken');
    setToken(null);
    setUser(null);
  };

  return (
    <ProviderAuthContext.Provider value={{ token, user, loginProvider, logoutProvider }}>
      {children}
    </ProviderAuthContext.Provider>
  );
};

export const useProviderAuth = () => useContext(ProviderAuthContext);
