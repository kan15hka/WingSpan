import { createContext, useContext, useEffect, useState } from "react";
import {
  removeUserFromLocalStorage,
  setUserToLocalStorage,
  getUserFromLocalStorage,
} from "../helper/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userData = getUserFromLocalStorage();
        if (userData.accessToken) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        removeUserFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loadUser = (userData) => {
    setUserToLocalStorage(userData);
    setUser(userData);
  };

  const removeUser = () => {
    removeUserFromLocalStorage();
    setUser(null);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ user, loadUser, removeUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
