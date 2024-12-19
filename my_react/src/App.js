// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PostDetail from './pages/PostDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/main.css';
import { PostProvider } from './contexts/PostContext.js';

const App = () => {
  return (
    <Router>
      <AuthProvider>
       <PostProvider>
          <Header />
          <main>
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/post/:postId" element={<PostDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </PostProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
