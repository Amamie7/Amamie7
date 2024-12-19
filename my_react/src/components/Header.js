import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-container">
          
          {/* Back Button */}
          <button onClick={handleBack} className="btn back-btn">
           {/* Less-than symbol */}
            &#x276E;
          </button>
          
            {/* LOGO */}
          <Link to="/" className="logo">
            <h1>K-MEDIA</h1>
          </Link>
          
          {/* Navigation Links */}
          <ul className="nav-links">
            {isLoggedIn && <li><Link to="/" className="nav-link">Home</Link></li>}
            {isLoggedIn && <li><Link to="/profile" className="nav-link">Profile</Link></li>}
          </ul>
  
          {/* Authentication buttons */}
          <div className="auth-buttons">
            {isLoggedIn ? (
              <button onClick={logout} className="btn logout-btn">Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">Login</Link>
                <Link to="/register" className="btn register-btn">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
