const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ id: String, url: String, desc: String }]
});

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/images/search', authenticateToken, async (req, res) => {
  try {
    const { page, query } = req.query;
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { page, query, client_id: process.env.UNSPLASH_ACCESS_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images' });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { id, url, desc } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.favorites.some(fav => fav.id === id)) {
      user.favorites.push({ id, url, desc });
      await user.save();
    }
    res.status(200).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite' });
  }
});

app.delete('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(fav => fav.id !== id);
    await user.save();
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/public/register.html'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));