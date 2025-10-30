import React, { createContext, useState, useContext } from "react";

const OwnerAuthContext = createContext();

export const OwnerAuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(() => JSON.parse(localStorage.getItem("owner")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("ownerToken") || null);

  const loginOwner = (data) => {
    setOwner(data);
    setToken(data.token);
    localStorage.setItem("owner", JSON.stringify(data));
    localStorage.setItem("ownerToken", data.token);
  };

  const logoutOwner = () => {
    setOwner(null);
    setToken(null);
    localStorage.removeItem("owner");
    localStorage.removeItem("ownerToken");
  };

  return (
    <OwnerAuthContext.Provider value={{ owner, token, loginOwner, logoutOwner }}>
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => useContext(OwnerAuthContext);
