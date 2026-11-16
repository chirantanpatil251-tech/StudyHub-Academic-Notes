import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('studyhub_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('studyhub_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('studyhub_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const response = await api.post('/auth/register', formData);
    const userData = response.data;
    setUser(userData);
    localStorage.setItem('studyhub_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyhub_user');
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('studyhub_user', JSON.stringify(updated));
  };

  const toggleBookmarkInState = (resourceId) => {
    if (!user) return;
    const currentBookmarks = user.bookmarks || [];
    const isPresent = currentBookmarks.some(
      (b) => (b?._id || b).toString() === resourceId.toString()
    );
    let updatedBookmarks;
    if (isPresent) {
      updatedBookmarks = currentBookmarks.filter(
        (b) => (b?._id || b).toString() !== resourceId.toString()
      );
    } else {
      updatedBookmarks = [...currentBookmarks, resourceId];
    }
    updateUser({ bookmarks: updatedBookmarks });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        toggleBookmarkInState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
