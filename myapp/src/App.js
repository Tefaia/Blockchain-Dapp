import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import * as api from './api/api';
import Header from './components/Header';
import Footer from './components/Footer';
import Wallet from './components/Wallet';
import Faucet from './components/Faucet';
import Peer from './components/Peer';
import Miner from './components/Miner';
import Block from './components/Block';
import Blockchain from './components/Blockchain';
import Marketplace from './components/Marketplace';
import ConnectedAddress from './components/ConnectedAddress';
import Transaction from './components/Transaction';

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
          <nav class="navbar navbar-expand-lg  bg-primary">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('wallet')}>My Wallet</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('faucet')}>Request Token</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('get-address')}>My Address</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('peer')}>Peers</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('miner')}>Mine Tokens</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('block')}>Blocks</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('blockchain')}>Blockchain</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('marketplace')}>Marketplace</button>
              </li>
              <li className="nav-item">
                <button class="nav-link text-white" onClick={() => handleNavigation('transaction ')}>Transactions</button>
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
          {/* Render components based on currentView */}
          {currentView === 'wallet' && <Wallet username={username} />}
          {currentView === 'faucet' && <Faucet username={username} />}
          {currentView === 'get-address' && <ConnectedAddress username={username} />}
          {currentView === 'peer' && <Peer username={username} />}
          {currentView === 'miner' && <Miner username={username} />}
          {currentView === 'block' && <Block username={username} />}
          {currentView === 'blockchain' && <Blockchain username={username} />}
          {currentView === 'marketplace' && <Marketplace username={username} />}
          {currentView === 'transaction ' && <Transaction username={username} />}

        </main>
      )}

      {isLoggedIn && <Footer />}
    </div>
  );
}

export default App;
