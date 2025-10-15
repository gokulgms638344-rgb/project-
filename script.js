// AI Mock Interview Platform - JavaScript
class MockInterviewApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.totalQuestions = 10;
        this.questionTime = 120; // 2 minutes in seconds
        this.sessionStartTime = null;
        this.sessionTimer = null;
        this.questionTimer = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.interviewType = 'general';
        this.questions = [];
        this.responses = [];
        this.scores = [];
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadQuestions();
        this.showWelcomeScreen();
    }

    setupEventListeners() {
        // Settings modal
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettingsModal();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Interview controls
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('endBtn').addEventListener('click', () => {
            this.endInterview();
        });

        document.getElementById('recordBtn').addEventListener('click', () => {
            this.startRecording();
        });

        document.getElementById('stopBtn').addEventListener('click', () => {
            this.stopRecording();
        });

        document.getElementById('skipBtn').addEventListener('click', () => {
            this.skipQuestion();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('finishBtn').addEventListener('click', () => {
            this.finishInterview();
        });
    }

    loadQuestions() {
        // Question database
        const questionDatabase = {
            technical: [
                {
                    question: "Explain the difference between let, const, and var in JavaScript.",
                    category: "JavaScript",
                    difficulty: "medium",
                    expectedKeywords: ["scope", "hoisting", "block", "function", "immutable", "mutable"]
                },
                {
                    question: "What is the time complexity of a binary search algorithm?",
                    category: "Algorithms",
                    difficulty: "easy",
                    expectedKeywords: ["O(log n)", "logarithmic", "divide", "conquer", "sorted", "array"]
                },
                {
                    question: "How would you optimize a slow database query?",
                    category: "Database",
                    difficulty: "hard",
                    expectedKeywords: ["index", "query plan", "normalization", "caching", "optimization"]
                },
                {
                    question: "Explain the concept of closures in JavaScript with an example.",
                    category: "JavaScript",
                    difficulty: "medium",
                    expectedKeywords: ["closure", "scope", "function", "lexical", "environment"]
                },
                {
                    question: "What are the main differences between SQL and NoSQL databases?",
                    category: "Database",
                    difficulty: "medium",
                    expectedKeywords: ["relational", "document", "ACID", "scalability", "schema"]
                },
                {
                    question: "How does the event loop work in Node.js?",
                    category: "Node.js",
                    difficulty: "hard",
                    expectedKeywords: ["event loop", "call stack", "callback queue", "microtask", "macrotask"]
                },
                {
                    question: "What is the difference between REST and GraphQL?",
                    category: "API",
                    difficulty: "medium",
                    expectedKeywords: ["REST", "GraphQL", "endpoints", "over-fetching", "under-fetching"]
                },
                {
                    question: "Explain the concept of dependency injection.",
                    category: "Design Patterns",
                    difficulty: "medium",
                    expectedKeywords: ["dependency", "injection", "inversion", "control", "loose coupling"]
                },
                {
                    question: "How would you implement a rate limiter?",
                    category: "System Design",
                    difficulty: "hard",
                    expectedKeywords: ["rate limiting", "token bucket", "sliding window", "throttling"]
                },
                {
                    question: "What is the difference between synchronous and asynchronous programming?",
                    category: "Programming Concepts",
                    difficulty: "easy",
                    expectedKeywords: ["synchronous", "asynchronous", "blocking", "non-blocking", "callback"]
                }
            ],
            behavioral: [
                {
                    question: "Tell me about a time when you had to work with a difficult team member.",
                    category: "Teamwork",
                    difficulty: "medium",
                    expectedKeywords: ["conflict", "resolution", "communication", "collaboration", "understanding"]
                },
                {
                    question: "Describe a situation where you had to learn a new technology quickly.",
                    category: "Learning",
                    difficulty: "medium",
                    expectedKeywords: ["learning", "adaptability", "research", "practice", "implementation"]
                },
                {
                    question: "Give me an example of a time when you failed and how you handled it.",
                    category: "Resilience",
                    difficulty: "medium",
                    expectedKeywords: ["failure", "learning", "improvement", "resilience", "growth"]
                },
                {
                    question: "Tell me about a project where you had to meet a tight deadline.",
                    category: "Time Management",
                    difficulty: "medium",
                    expectedKeywords: ["deadline", "prioritization", "planning", "efficiency", "delivery"]
                },
                {
                    question: "Describe a time when you had to explain a complex technical concept to a non-technical person.",
                    category: "Communication",
                    difficulty: "medium",
                    expectedKeywords: ["communication", "simplification", "analogy", "patience", "clarity"]
                },
                {
                    question: "Tell me about a time when you had to make a difficult decision without all the information.",
                    category: "Decision Making",
                    difficulty: "hard",
                    expectedKeywords: ["decision", "uncertainty", "analysis", "risk", "judgment"]
                },
                {
                    question: "Describe a situation where you had to work under pressure.",
                    category: "Stress Management",
                    difficulty: "medium",
                    expectedKeywords: ["pressure", "calm", "focus", "prioritization", "performance"]
                },
                {
                    question: "Tell me about a time when you had to lead a team or project.",
                    category: "Leadership",
                    difficulty: "medium",
                    expectedKeywords: ["leadership", "guidance", "motivation", "coordination", "responsibility"]
                },
                {
                    question: "Describe a time when you had to adapt to a significant change at work.",
                    category: "Adaptability",
                    difficulty: "medium",
                    expectedKeywords: ["change", "adaptation", "flexibility", "openness", "adjustment"]
                },
                {
                    question: "Tell me about a time when you went above and beyond for a customer or client.",
                    category: "Customer Service",
                    difficulty: "medium",
                    expectedKeywords: ["customer", "service", "exceed", "expectations", "dedication"]
                }
            ],
            general: [
                {
                    question: "Why are you interested in this position?",
                    category: "Motivation",
                    difficulty: "easy",
                    expectedKeywords: ["interest", "passion", "career", "growth", "opportunity"]
                },
                {
                    question: "What are your greatest strengths?",
                    category: "Self-Assessment",
                    difficulty: "easy",
                    expectedKeywords: ["strengths", "skills", "experience", "achievements", "value"]
                },
                {
                    question: "What is your biggest weakness and how are you working to improve it?",
                    category: "Self-Awareness",
                    difficulty: "medium",
                    expectedKeywords: ["weakness", "improvement", "growth", "self-awareness", "development"]
                },
                {
                    question: "Where do you see yourself in 5 years?",
                    category: "Career Goals",
                    difficulty: "easy",
                    expectedKeywords: ["goals", "career", "growth", "aspirations", "planning"]
                },
                {
                    question: "Why should we hire you?",
                    category: "Value Proposition",
                    difficulty: "medium",
                    expectedKeywords: ["value", "unique", "skills", "experience", "contribution"]
                },
                {
                    question: "What do you know about our company?",
                    category: "Research",
                    difficulty: "easy",
                    expectedKeywords: ["company", "research", "values", "mission", "culture"]
                },
                {
                    question: "What motivates you in your work?",
                    category: "Motivation",
                    difficulty: "easy",
                    expectedKeywords: ["motivation", "passion", "purpose", "challenge", "impact"]
                },
                {
                    question: "How do you handle stress and pressure?",
                    category: "Stress Management",
                    difficulty: "medium",
                    expectedKeywords: ["stress", "pressure", "coping", "strategies", "resilience"]
                },
                {
                    question: "What questions do you have for us?",
                    category: "Engagement",
                    difficulty: "easy",
                    expectedKeywords: ["questions", "curiosity", "engagement", "interest", "understanding"]
                },
                {
                    question: "Describe your ideal work environment.",
                    category: "Culture Fit",
                    difficulty: "easy",
                    expectedKeywords: ["environment", "culture", "collaboration", "autonomy", "support"]
                }
            ]
        };

        this.questions = questionDatabase[this.interviewType] || questionDatabase.general;
    }

    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('interviewScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'none';
    }

    showInterviewScreen() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('interviewScreen').style.display = 'block';
        document.getElementById('resultsScreen').style.display = 'none';
    }

    showResultsScreen() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('interviewScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'block';
    }

    startInterview(type) {
        this.interviewType = type;
        this.currentQuestionIndex = 0;
        this.responses = [];
        this.scores = [];
        this.loadQuestions();
        
        document.getElementById('totalQuestions').textContent = this.totalQuestions;
        this.updateProgress();
        this.showCurrentQuestion();
        this.showInterviewScreen();
        this.startSessionTimer();
    }

    showCurrentQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        
        // Reset UI state
        this.resetQuestionUI();
        this.startQuestionTimer();
    }

    resetQuestionUI() {
        document.getElementById('recordBtn').style.display = 'inline-flex';
        document.getElementById('stopBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('finishBtn').style.display = 'none';
        document.getElementById('feedbackSection').style.display = 'none';
        document.getElementById('recordingIndicator').classList.remove('active');
        document.getElementById('recordingStatus').textContent = 'Click to start recording your answer';
        this.isRecording = false;
    }

    startSessionTimer() {
        this.sessionStartTime = Date.now();
        this.sessionTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('sessionTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    startQuestionTimer() {
        let timeLeft = this.questionTime;
        document.getElementById('questionTimer').textContent = this.formatTime(timeLeft);
        
        this.questionTimer = setInterval(() => {
            timeLeft--;
            document.getElementById('questionTimer').textContent = this.formatTime(timeLeft);
            
            if (timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    timeUp() {
        clearInterval(this.questionTimer);
        if (this.isRecording) {
            this.stopRecording();
        }
        this.showFeedback("Time's up! Moving to next question...");
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.processRecording(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            
            document.getElementById('recordBtn').style.display = 'none';
            document.getElementById('stopBtn').style.display = 'inline-flex';
            document.getElementById('recordingIndicator').classList.add('active');
            document.getElementById('recordingStatus').textContent = 'Recording... Click stop when finished';
            
            this.startAudioVisualization();
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            document.getElementById('recordBtn').style.display = 'inline-flex';
            document.getElementById('stopBtn').style.display = 'none';
            document.getElementById('recordingIndicator').classList.remove('active');
            document.getElementById('recordingStatus').textContent = 'Processing your response...';
        }
    }

    startAudioVisualization() {
        const canvas = document.getElementById('visualizerCanvas');
        const ctx = canvas.getContext('2d');
        
        const draw = () => {
            if (this.isRecording) {
                requestAnimationFrame(draw);
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#667eea';
                
                for (let i = 0; i < 50; i++) {
                    const barHeight = Math.random() * canvas.height;
                    const barWidth = canvas.width / 50;
                    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
                }
            }
        };
        
        draw();
    }

    async processRecording(audioBlob) {
        // Simulate AI processing
        const processingTime = Math.random() * 2000 + 1000; // 1-3 seconds
        
        setTimeout(() => {
            const score = this.generateAIScore();
            const feedback = this.generateAIFeedback(score);
            
            this.responses.push({
                question: this.questions[this.currentQuestionIndex].question,
                audioBlob: audioBlob,
                score: score,
                feedback: feedback,
                timestamp: new Date()
            });
            
            this.scores.push(score);
            this.showFeedback(feedback, score);
            
            // Show next/finish button
            if (this.currentQuestionIndex < this.totalQuestions - 1) {
                document.getElementById('nextBtn').style.display = 'inline-flex';
            } else {
                document.getElementById('finishBtn').style.display = 'inline-flex';
            }
        }, processingTime);
    }

    generateAIScore() {
        // Simulate AI scoring based on response length, keywords, etc.
        const baseScore = Math.random() * 40 + 30; // 30-70 base score
        const bonus = Math.random() * 30; // 0-30 bonus
        return Math.min(Math.round(baseScore + bonus), 100);
    }

    generateAIFeedback(score) {
        const question = this.questions[this.currentQuestionIndex];
        const keywords = question.expectedKeywords;
        
        let feedback = "";
        
        if (score >= 80) {
            feedback = "Excellent answer! You demonstrated strong understanding and provided comprehensive insights. ";
        } else if (score >= 60) {
            feedback = "Good answer with solid points. Consider providing more specific examples. ";
        } else if (score >= 40) {
            feedback = "Your answer shows some understanding but could be more detailed. ";
        } else {
            feedback = "Your answer needs more depth and specific examples. ";
        }
        
        // Add keyword-based feedback
        const mentionedKeywords = keywords.filter(keyword => 
            Math.random() > 0.7 // Simulate keyword detection
        );
        
        if (mentionedKeywords.length > 0) {
            feedback += `You mentioned relevant concepts like ${mentionedKeywords.join(', ')}. `;
        }
        
        // Add improvement suggestions
        const suggestions = [
            "Try to provide specific examples from your experience.",
            "Consider structuring your answer with clear points.",
            "Think about the STAR method (Situation, Task, Action, Result) for behavioral questions.",
            "Be more specific about your technical knowledge and experience."
        ];
        
        feedback += suggestions[Math.floor(Math.random() * suggestions.length)];
        
        return feedback;
    }

    showFeedback(feedback, score) {
        document.getElementById('feedbackSection').style.display = 'block';
        document.getElementById('overallScore').textContent = `${score}/100`;
        document.getElementById('feedbackDetails').textContent = feedback;
    }

    skipQuestion() {
        this.responses.push({
            question: this.questions[this.currentQuestionIndex].question,
            skipped: true,
            timestamp: new Date()
        });
        
        this.nextQuestion();
    }

    nextQuestion() {
        clearInterval(this.questionTimer);
        
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.currentQuestionIndex++;
            this.updateProgress();
            this.showCurrentQuestion();
        } else {
            this.finishInterview();
        }
    }

    finishInterview() {
        clearInterval(this.questionTimer);
        clearInterval(this.sessionTimer);
        this.showResults();
    }

    showResults() {
        const totalScore = this.scores.length > 0 
            ? Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length)
            : 0;
        
        const totalTime = this.sessionStartTime 
            ? Math.floor((Date.now() - this.sessionStartTime) / 1000)
            : 0;
        
        const questionsAnswered = this.responses.filter(r => !r.skipped).length;
        
        document.getElementById('finalScore').textContent = totalScore;
        document.getElementById('totalTime').textContent = this.formatTime(totalTime);
        document.getElementById('questionsAnswered').textContent = questionsAnswered;
        
        this.generateDetailedFeedback();
        this.showResultsScreen();
    }

    generateDetailedFeedback() {
        const categories = {};
        
        this.responses.forEach(response => {
            if (!response.skipped && response.score) {
                const question = this.questions.find(q => q.question === response.question);
                if (question) {
                    if (!categories[question.category]) {
                        categories[question.category] = {
                            scores: [],
                            feedback: []
                        };
                    }
                    categories[question.category].scores.push(response.score);
                    categories[question.category].feedback.push(response.feedback);
                }
            }
        });
        
        const feedbackContainer = document.getElementById('feedbackCategories');
        feedbackContainer.innerHTML = '';
        
        Object.keys(categories).forEach(category => {
            const avgScore = Math.round(
                categories[category].scores.reduce((a, b) => a + b, 0) / 
                categories[category].scores.length
            );
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'feedback-category';
            categoryDiv.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-score">Score: ${avgScore}/100</div>
                <div class="category-feedback">${categories[category].feedback[0]}</div>
            `;
            feedbackContainer.appendChild(categoryDiv);
        });
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    togglePause() {
        // Implement pause functionality
        const btn = document.getElementById('pauseBtn');
        if (btn.innerHTML.includes('Pause')) {
            btn.innerHTML = '<i class="fas fa-play"></i> Resume';
            clearInterval(this.questionTimer);
        } else {
            btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.startQuestionTimer();
        }
    }

    endInterview() {
        if (confirm('Are you sure you want to end the interview? Your progress will be lost.')) {
            clearInterval(this.questionTimer);
            clearInterval(this.sessionTimer);
            this.showWelcomeScreen();
        }
    }

    showSettingsModal() {
        document.getElementById('settingsModal').classList.add('active');
    }

    hideSettingsModal() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    saveSettings() {
        this.totalQuestions = parseInt(document.getElementById('questionCount').value);
        this.questionTime = parseInt(document.getElementById('questionTime').value);
        this.hideSettingsModal();
    }

    restartInterview() {
        this.showWelcomeScreen();
    }

    downloadReport() {
        // Create a simple text report
        const report = this.generateReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateReport() {
        const totalScore = this.scores.length > 0 
            ? Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length)
            : 0;
        
        let report = `AI Mock Interview Report\n`;
        report += `========================\n\n`;
        report += `Interview Type: ${this.interviewType.charAt(0).toUpperCase() + this.interviewType.slice(1)}\n`;
        report += `Date: ${new Date().toLocaleDateString()}\n`;
        report += `Total Score: ${totalScore}/100\n`;
        report += `Questions Answered: ${this.responses.filter(r => !r.skipped).length}\n\n`;
        
        report += `Question Responses:\n`;
        report += `==================\n\n`;
        
        this.responses.forEach((response, index) => {
            report += `${index + 1}. ${response.question}\n`;
            if (response.skipped) {
                report += `   Status: Skipped\n\n`;
            } else {
                report += `   Score: ${response.score}/100\n`;
                report += `   Feedback: ${response.feedback}\n\n`;
            }
        });
        
        return report;
    }

    goHome() {
        this.showWelcomeScreen();
    }
}

// Global functions for HTML onclick handlers
function startInterview(type) {
    window.mockInterviewApp.startInterview(type);
}

function restartInterview() {
    window.mockInterviewApp.restartInterview();
}

function downloadReport() {
    window.mockInterviewApp.downloadReport();
}

function goHome() {
    window.mockInterviewApp.goHome();
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mockInterviewApp = new MockInterviewApp();
});

// Add some utility functions for better UX
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close modals on escape
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add loading states for better UX
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Add error handling for microphone access
navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || 
    navigator.mediaDevices.webkitGetUserMedia || 
    navigator.mediaDevices.mozGetUserMedia;

if (!navigator.mediaDevices.getUserMedia) {
    console.warn('getUserMedia is not supported in this browser');
    // Show a message to the user about browser compatibility
    document.addEventListener('DOMContentLoaded', () => {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 1000;
            max-width: 300px;
        `;
        warning.textContent = 'Your browser may not support audio recording. Please use Chrome, Firefox, or Safari.';
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 5000);
    });
}