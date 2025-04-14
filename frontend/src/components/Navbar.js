import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      style={{
        padding: '1rem 0',
        backgroundColor: '#FFE5B4',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end', // Align items to the right
          gap: '2rem',
          alignItems: 'center',
        }}
      ></div>

      <ul
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '1rem',
          listStyle: 'none',
        }}
      >
        {/* Home Link */}
        <li>
          <Link
            to="/home"
            style={linkStyle}
          >
            Home
          </Link>
        </li>

        {/* Login Link */}
        <li>
          <Link
            to="/login"
            style={linkStyle}
          >
            Login
          </Link>
        </li>

        {/* Register Link */}
        <li>
          <Link
            to="/register"
            style={linkStyle}
          >
            Register
          </Link>
        </li>

        {/* Generate Link */}
        <li>
          <Link
            to="/generate"
            style={linkStyle}
          >
            Generate
          </Link>
        </li>

        {/* History Link */}
        <li>
          <Link
            to="/history"
            style={linkStyle}
          >
            History
          </Link>
        </li>
      </ul>
    </nav>
  );
};

// Reusable styles for links
const linkStyle = {
  textDecoration: 'none',
  backgroundColor: '#CC5500', // burnt orange
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
};

export default Navbar;
