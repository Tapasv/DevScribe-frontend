import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// HARD-CODED BACKEND BASE
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Header() {
  const [categories, setCategories] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.results || res.data || []))
      .catch((err) => console.error('Header categories error:', err));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">DevScribe</Link>

        <div className="nav-desktop">
          <Link to="/">Home</Link>

          {categories.slice(0, 4).map((cat) => (
            <Link key={cat.id} to={`/category/${cat.slug}`}>
              {cat.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="user-menu">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}>
                {user?.username}
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile">My Profile</Link>
                  {profile?.role === 'author' && (
                    <Link to="/create-post">Create Post</Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}

          {/* Admin */}
          <a href={`${BASE_URL}/admin`} target="_blank" rel="noreferrer">
            Admin
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
