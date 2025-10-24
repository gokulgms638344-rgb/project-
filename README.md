# AI Mock Interview Platform

A full-stack web application for practicing interview skills with AI-powered feedback, built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **User Authentication**: Secure login and registration system
- **Multiple Interview Types**: Technical, Behavioral, and General interviews
- **Audio Recording**: Record your answers with real-time visualization
- **AI Feedback**: Get instant feedback and scoring on your responses
- **Session Management**: Save and track your interview progress
- **Responsive Design**: Works on desktop and mobile devices
- **MongoDB Integration**: Persistent data storage for users and sessions

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-mock-interview-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-interview-platform
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env with your Atlas connection string
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Register/Login**: Create a new account or sign in with existing credentials
2. **Choose Interview Type**: Select from Technical, Behavioral, or General interviews
3. **Configure Settings**: Adjust number of questions, time per question, and difficulty
4. **Start Interview**: Begin recording your answers to interview questions
5. **Get Feedback**: Receive AI-powered feedback and scoring after each response
6. **View Results**: See your overall performance and detailed feedback
7. **Track Progress**: Your interview sessions are saved and can be reviewed later

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Interview Sessions
- `POST /api/interview/start` - Start a new interview session
- `POST /api/interview/:sessionId/response` - Save interview response
- `POST /api/interview/:sessionId/complete` - Complete interview session
- `GET /api/interview/history` - Get user's interview history
- `GET /api/interview/:sessionId` - Get specific interview session

## Project Structure

```
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── index.html             # Main HTML file
├── styles.css             # CSS styles
├── script.js              # Frontend JavaScript
└── README.md              # This file
```

## Features in Detail

### Authentication System
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcryptjs
- Session management

### Interview Types
- **Technical**: Programming and technical questions
- **Behavioral**: Situational and behavioral questions
- **General**: Mixed interview questions

### Audio Recording
- Browser-based audio recording
- Real-time audio visualization
- Base64 encoding for storage

### AI Feedback System
- Simulated AI scoring (0-100)
- Keyword-based feedback
- Category-specific analysis
- Improvement suggestions

### Data Persistence
- User profiles and authentication
- Interview session storage
- Response tracking and history
- Performance analytics

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts on file changes.

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 3000)

## Deployment

1. **Prepare for production**:
   - Update JWT_SECRET to a secure random string
   - Set up MongoDB Atlas or production MongoDB instance
   - Configure environment variables

2. **Deploy to your preferred platform**:
   - Heroku
   - DigitalOcean
   - AWS
   - Google Cloud Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.