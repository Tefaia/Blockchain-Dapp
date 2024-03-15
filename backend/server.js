// Import the necessary modules and dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Import the MySQL connection pool
//const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const walletRoutes = require('./wallet');
const faucetRoutes = require('./faucet');
const { generateNewAddress } = require('./generateaddress');
const peerRoutes = require('./peer');
const minerRoutes = require('./miner');
const blockRoutes = require('./block');
const blockchainRoutes = require('./blockchain');
const CreateBlock = require('./createblock');
const helmet = require('helmet');
const uuid = require('uuid');
const CreateBlockchain = require('./createblockchain');  // Import the CreateBlockchain class
const marketplaceRoutes=require('./marketplace');
// Initialize an array to store connected peers
let connectedPeers = [];
// Define the generateSessionId function
function generateSessionId() {
  let sessionId = uuid.v4();
  while (!sessionId) {
    sessionId = uuid.v4();
  }
  return sessionId;
}

// Create an instance of Express application
const app = express();
const port = 3002;

// Middleware setup
app.use(bodyParser.json());
app.use(helmet());

// Set up CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Express session and cookie parser setup
app.use(cookieParser());
app.use(session({
  genid: generateSessionId,
  secret: 'my-blockchain-app', // Change this to a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000, // Session expiration time (1 hour)
    httpOnly: true,
    secure: false, // Change to true in production if using HTTPS
    sameSite: 'strict', // Set to 'strict' for added security
  },
}));

// Define the CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Authentication routes
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log('Received signup request for username:', username);
    if (results.length > 0) {
      console.log('User already exists:', username);
      res.status(409).json({ error: 'User already exists' });
    } else {
      pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
          console.error('Error signing up:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('User signed up successfully:', username);
          res.status(201).json({ message: 'User signed up successfully' });
        }
      });
    }
  });
});

// Define authenticateSession function
function authenticateSession(req, res, next) {
  if (req.session && req.session.username) {
      // If session exists and user is authenticated, proceed to the next middleware
      next();
  } else {
      // If session does not exist or user is not authenticated, send a 401 Unauthorized response
      res.status(401).json({ error: 'Unauthorized' });
  }
}

async function getUserFromDatabase(username) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]); // Resolve with the first user found
      }
    });
  });
}

// POST /login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve user from the database
    const user = await getUserFromDatabase(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a route for user logout
app.post('/logout', (req, res) => {
  console.log('Received logout request');

  const username = req.session.username;

  // Delete the session data from the sessions table
  pool.query('DELETE FROM logged_in_users WHERE username = ?', [username], (err) => {
    if (err) {
      console.error('Error deleting session data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Logout successful');
      req.session.destroy(); // Destroy the session
      res.clearCookie('session_id'); // Clear the session cookie

      

      res.status(200).json({ message: 'Logout successful' });
    }
  });
});

// Dashboard route
app.get('/dashboard', authenticateSession, (req, res) => {
  const { username } = req.session;

  pool.query('SELECT * FROM logged_in_users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        const userDashboardData = results[0];
        res.status(200).json(userDashboardData);
      } else {
        res.status(404).json({ error: 'User data not found' });
      }
    }
  });
});

let blockchain = [new CreateBlock(0, new Date().toISOString(), [], '0')];
app.use('/wallet', walletRoutes);
app.use('/faucet', faucetRoutes);
app.use('/peers', peerRoutes);
app.use('/mining', minerRoutes);
app.use('/blocks', blockRoutes);
app.use('/blockchain', blockchainRoutes);
app.use('/marketplace', marketplaceRoutes);

app.listen(port, () => {
  console.log(`Backend Server running on http://localhost:${port}`);
});
