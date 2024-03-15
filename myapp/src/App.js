import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import * as api from './api/api';
import Header from './components/Header';
import Footer from './components/Footer';
import Wallet from './components/Wallet';
import Faucet from './components/Faucet';
import GenerateAddress from './components/GenerateAddress';
import Peer from './components/Peer';
import Miner from './components/Miner';
import Block from './components/Block';
import Blockchain from './components/Blockchain';
import Marketplace from './components/Marketplace';


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoginView, setLoginView] = useState(true);
  const [message, setMessage] = useState('');
  const [currentView, setCurrentView] = useState('login');

  const handleLogout = () => {
    // Call the logout function from the API
    api.handleLogout(setLoggedIn, setMessage);
  };


  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />

      {isLoggedIn ? (
        <div>
          {/* Content for logged-in user */}
          <nav>
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('wallet')}>Wallet</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('faucet')}>Faucet</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('generate-address')}>Generate Address</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('peer')}>Peer</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('miner')}>Miner</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('block')}>Block</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('blockchain')}>Blockchain</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => handleNavigation('marketplace')}>Marketplace</button>
              </li>

            </ul>
          </nav>
        </div>
      ) : (
        <div>
          {/* Login or Signup forms */}
          {isLoginView ? (
            <div className="mb-3">
              <h2>Login</h2>
              {message && <p className="text-danger">{message}</p>}
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button className="btn btn-success" onClick={() => api.handleLogin(username, password, setLoggedIn, setMessage)}>
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
              <p className="mt-3">Don't have an account? <span onClick={() => api.toggleView(setLoginView, setMessage)} style={{ cursor: 'pointer', color: 'blue' }}>Signup here</span>.</p>
            </div>
          ) : (
            <div className="mb-3">
              <h2>Signup</h2>
              {message && <p className="text-danger">{message}</p>}
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={() => api.handleSignup(username, password, setMessage)}>
                <i className="fas fa-user-plus"></i> Signup
              </button>
              <p className="mt-3">Already have an account? <span onClick={() => api.toggleView(setLoginView, setMessage)} style={{ cursor: 'pointer', color: 'blue' }}>Login here</span>.</p>
            </div>
          )}
        </div>
      )}

      {isLoggedIn && (
        <main className="container">
          {currentView === 'wallet' && <Wallet />}
          {currentView === 'faucet' && <Faucet />}
          {currentView === 'generate-address' && <GenerateAddress />}
          {currentView === 'peer' && <Peer />}
          {currentView === 'miner' && <Miner />}
          {currentView === 'block' && <Block />}
          {currentView === 'blockchain' && <Blockchain />}
          {currentView === 'marketplace' && <Marketplace />}

        </main>
      )}

      {isLoggedIn && <Footer />}
    </div>
  );
}

export default App;
