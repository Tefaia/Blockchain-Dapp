import React from 'react';

function Header({ isLoggedIn, username, handleLogout }) {
  return (
    <header className="bg-primary text-white text-center p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="logo.png" alt="Logo" style={{ width: '80px',height: '80px', marginRight: '10px' }} />
          <h1 className="mb-0">Blockchain App</h1>
        </div>
        <div>
          {/* Font Awesome cog icon */}

          {isLoggedIn && (
            <div className="ml-3">
              <p className="mb-0 mr-2">Welcome, {username}!</p>
              <button className="btn btn-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
