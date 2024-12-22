const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Basic Configuration
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory storage
const users = [];
const exercises = [];

// Helper function to generate IDs
const generateId = () => Date.now().toString();

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Create new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const newUser = {
    username,
    _id: generateId()
  };

  users.push(newUser);
  res.json(newUser);
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Add exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const user = users.find(u => u._id === req.params._id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const exercise = {
    username: user.username,
    description,
    duration: Number(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
    _id: user._id
  };

  exercises.push(exercise);

  res.json(exercise);
});

// Get user's exercise log
app.get('/api/users/:_id/logs', (req, res) => {
  const { from, to, limit } = req.query;
  const user = users.find(u => u._id === req.params._id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let userExercises = exercises
    .filter(e => e._id === user._id)
    .map(e => ({
      description: e.description,
      duration: Number(e.duration),
      date: e.date
    }));

  // Apply date filter if provided
  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(e => new Date(e.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(e => new Date(e.date) <= toDate);
  }

  // Apply limit if provided
  if (limit) {
    userExercises = userExercises.slice(0, Number(limit));
  }

  const log = {
    username: user.username,
    count: userExercises.length,
    _id: user._id,
    log: userExercises
  };

  res.json(log);
});

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});