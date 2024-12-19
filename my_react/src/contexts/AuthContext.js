import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = JSON.parse(localStorage.getItem('user'));
          setUser(data);
          setIsLoggedIn(true)
          console.log('user data', data)
        } catch (error) {
          console.error('Not authenticated', error);
        }
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setIsLoggedIn(true)
    setUser(data.user);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false)
    setUser(null);
    navigate('/login');
  };



  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoggedIn}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
