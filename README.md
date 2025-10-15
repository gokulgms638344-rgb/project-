# AI Mock Interview Platform

A modern, interactive AI-powered mock interview website that helps users practice their interview skills with real-time feedback and scoring.

## Features

### 🎯 **Interview Types**
- **Technical Interviews** - Coding and technical questions
- **Behavioral Interviews** - Situational and behavioral questions  
- **General Interviews** - Mixed questions for comprehensive practice

### 🎤 **Audio Recording**
- Real-time audio recording with visual feedback
- Audio visualization during recording
- Automatic processing and analysis

### 🤖 **AI-Powered Feedback**
- Real-time scoring system (0-100 scale)
- Detailed feedback on responses
- Keyword analysis and suggestions
- Category-based performance tracking

### ⚙️ **Customizable Settings**
- Adjustable number of questions (5-20)
- Configurable time per question (1-5 minutes)
- Difficulty levels (Easy, Medium, Hard)
- Session management and progress tracking

### 📊 **Comprehensive Results**
- Overall performance score
- Category-wise breakdown
- Detailed feedback report
- Downloadable interview report

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Microphone access for audio recording
- Python 3.x (for local development server)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd ai-mock-interview-website
   ```

2. **Start the local development server**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Node.js (if you have it installed)
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:8000`

### Alternative: Direct File Access
You can also open `index.html` directly in your browser, but some features may be limited due to browser security restrictions.

## Usage

### Starting an Interview
1. Choose your interview type (Technical, Behavioral, or General)
2. Configure settings if needed (number of questions, time per question, difficulty)
3. Click "Start Interview" to begin

### During the Interview
1. Read the question carefully
2. Click "Start Recording" to begin your response
3. Speak your answer clearly
4. Click "Stop Recording" when finished
5. Review AI feedback and score
6. Click "Next Question" to continue

### Reviewing Results
- View your overall performance score
- Check category-wise breakdown
- Read detailed feedback
- Download a comprehensive report

## Technical Features

### Frontend Technologies
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)** - Interactive functionality and audio processing
- **Web APIs** - MediaRecorder API for audio recording

### Browser Compatibility
- Chrome 47+
- Firefox 25+
- Safari 14+
- Edge 79+

### Audio Recording
- Uses Web Audio API and MediaRecorder API
- Real-time audio visualization
- Automatic audio processing and analysis

## File Structure

```
ai-mock-interview-website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── package.json        # Project configuration
└── README.md          # Project documentation
```

## Customization

### Adding New Questions
Edit the `questionDatabase` object in `script.js` to add new questions:

```javascript
const questionDatabase = {
    technical: [
        {
            question: "Your new question here",
            category: "Category Name",
            difficulty: "easy|medium|hard",
            expectedKeywords: ["keyword1", "keyword2", "keyword3"]
        }
    ]
};
```

### Modifying AI Feedback
Update the `generateAIFeedback()` method in `script.js` to customize feedback logic.

### Styling Changes
Modify `styles.css` to change colors, fonts, layouts, or animations.

## Browser Requirements

### Required Features
- **MediaRecorder API** - For audio recording
- **Web Audio API** - For audio visualization
- **ES6+ Support** - For modern JavaScript features
- **CSS Grid/Flexbox** - For responsive layout

### Recommended Browsers
- **Chrome 60+** - Full feature support
- **Firefox 55+** - Full feature support
- **Safari 14+** - Full feature support
- **Edge 79+** - Full feature support

## Troubleshooting

### Audio Recording Issues
- Ensure microphone permissions are granted
- Check browser compatibility
- Try refreshing the page
- Use HTTPS in production environments

### Performance Issues
- Close unnecessary browser tabs
- Ensure stable internet connection
- Check browser console for errors

### Mobile Compatibility
- Audio recording works on mobile browsers
- Touch-friendly interface
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Modern web APIs for audio functionality
- Community feedback and suggestions

## Support

For issues, questions, or feature requests, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Interviewing! 🎤✨**