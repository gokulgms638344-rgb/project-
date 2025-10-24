const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DEMO_MODE = !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => {
  console.log('MongoDB connection failed:', err.message);
  console.log('Running in demo mode without database persistence');
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Interview Session Schema
const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewType: {
    type: String,
    enum: ['technical', 'behavioral', 'general'],
    required: true
  },
  questions: [{
    question: String,
    category: String,
    difficulty: String,
    expectedKeywords: [String]
  }],
  responses: [{
    question: String,
    audioBlob: String, // Base64 encoded audio
    score: Number,
    feedback: String,
    timestamp: Date,
    skipped: Boolean
  }],
  totalScore: Number,
  totalTime: Number,
  questionsAnswered: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

// Models
const User = mongoose.model('User', userSchema);
const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  if (DEMO_MODE) {
    // Demo mode - return mock user
    const token = jwt.sign(
      { userId: 'demo-user', username: req.body.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.status(201).json({
      message: 'Demo user created successfully',
      token,
      user: {
        id: 'demo-user',
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      }
    });
  }
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (DEMO_MODE) {
    // Demo mode - return mock user
    const token = jwt.sign(
      { userId: 'demo-user', username: 'demo' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({
      message: 'Demo login successful',
      token,
      user: {
        id: 'demo-user',
        username: 'demo',
        email: req.body.email,
        firstName: 'Demo',
        lastName: 'User'
      }
    });
  }
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  if (DEMO_MODE) {
    return res.json({
      user: {
        id: 'demo-user',
        username: 'demo',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User'
      }
    });
  }
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Interview Session Routes
app.post('/api/interview/start', authenticateToken, async (req, res) => {
  if (DEMO_MODE) {
    return res.status(201).json({
      message: 'Demo interview session started',
      sessionId: 'demo-session-' + Date.now()
    });
  }
  try {
    const { interviewType, questions } = req.body;

    const session = new InterviewSession({
      userId: req.user.userId,
      interviewType,
      questions
    });

    await session.save();

    res.status(201).json({
      message: 'Interview session started',
      sessionId: session._id
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/interview/:sessionId/response', authenticateToken, async (req, res) => {
  if (DEMO_MODE) {
    return res.json({ message: 'Demo response saved successfully' });
  }
  try {
    const { sessionId } = req.params;
    const { question, audioBlob, score, feedback, skipped } = req.body;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.user.userId
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    const response = {
      question,
      audioBlob,
      score,
      feedback,
      timestamp: new Date(),
      skipped: skipped || false
    };

    session.responses.push(response);
    await session.save();

    res.json({ message: 'Response saved successfully' });
  } catch (error) {
    console.error('Save response error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/interview/:sessionId/complete', authenticateToken, async (req, res) => {
  if (DEMO_MODE) {
    return res.json({ message: 'Demo interview completed successfully' });
  }
  try {
    const { sessionId } = req.params;
    const { totalScore, totalTime, questionsAnswered } = req.body;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.user.userId
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    session.totalScore = totalScore;
    session.totalTime = totalTime;
    session.questionsAnswered = questionsAnswered;
    session.completedAt = new Date();

    await session.save();

    res.json({ message: 'Interview completed successfully' });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/interview/history', authenticateToken, async (req, res) => {
  if (DEMO_MODE) {
    return res.json({ sessions: [] });
  }
  try {
    const sessions = await InterviewSession.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-responses.audioBlob'); // Exclude audio data for performance

    res.json({ sessions });
  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/interview/:sessionId', authenticateToken, async (req, res) => {
  if (DEMO_MODE) {
    return res.json({ session: null });
  }
  try {
    const { sessionId } = req.params;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId: req.user.userId
    });

    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get interview session error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connected: ${mongoose.connection.readyState === 1 ? 'Yes' : 'No'}`);
});