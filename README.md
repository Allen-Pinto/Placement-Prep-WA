# PrepSaaS - Interview Preparation Platform

<div align="center">

![PrepSaaS Logo](https://img.shields.io/badge/PrepSaaS-Interview%20Prep-6366f1?style=for-the-badge&logo=graduation-cap&logoColor=white)

**A comprehensive SaaS platform for technical interview preparation with AI-powered mock interviews, coding practice, and performance analytics.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://placement-prep-wa.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Docs-blue?style=for-the-badge&logo=swagger)](https://placement-prep-wa.onrender.com/api/docs)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Demo](#-demo) • [API Documentation](#-api-documentation)

</div>

---

## 🌟 Features

### 🎯 Core Functionality
- **🔐 Multi-Auth System** - Email/Password, Google OAuth, GitHub OAuth
- **💻 Coding Practice** - LeetCode-style problems with multiple difficulty levels
- **🎤 Mock Interviews** - AI-powered technical interview simulations
- **📊 Performance Analytics** - Track progress with detailed statistics
- **📝 Resume Analysis** - AI-powered resume feedback and suggestions
- **🗓️ Interview Scheduler** - Manage and track upcoming interviews
- **🏆 Quiz System** - Timed quizzes on various technical topics

### ⚡ Additional Features
- **Dark Mode UI** - Beautiful, modern dark-themed interface
- **Real-time Progress Tracking** - Live updates on quiz attempts
- **Topic-based Practice** - Arrays, DP, Trees, Graphs, System Design
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Secure Authentication** - JWT-based with HTTP-only cookies
- **Rate Limiting** - Protection against abuse

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.15-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0.2-FF6B00?style=flat-square)
![React Router](https://img.shields.io/badge/React%20Router-6.28.0-CA4245?style=flat-square&logo=react-router&logoColor=white)

- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **Lucide Icons** - Beautiful, consistent icons
- **React Hot Toast** - Elegant notifications

### Backend
![Node.js](https://img.shields.io/badge/Node.js-22.20.0-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21.1-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.8.3-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=flat-square&logo=json-web-tokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport-0.7.0-34E27A?style=flat-square)

- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database with ODM
- **Passport.js** - OAuth2.0 authentication
- **JWT** - Secure token-based authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Version Control:** Git & GitHub

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas account)
- Google OAuth credentials
- GitHub OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/placement-prep.git
cd placement-prep
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL
```

### Environment Variables

#### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Session
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5001/api/auth/github/callback

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
VITE_NODE_ENV=development
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the app in action! 🎉

#### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

---

## 📸 Demo

### Login & Authentication
![Login Screen](https://via.placeholder.com/800x400/1a1a1a/6366f1?text=Login+Screen)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/1a1a1a/22c55e?text=Dashboard)

### Coding Practice
![Coding Practice](https://via.placeholder.com/800x400/1a1a1a/f59e0b?text=Coding+Practice)

### Mock Interview
![Mock Interview](https://via.placeholder.com/800x400/1a1a1a/ef4444?text=Mock+Interview)

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### OAuth Login
```http
GET /api/auth/google
GET /api/auth/github
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Quiz Endpoints

#### Get All Quizzes
```http
GET /api/quizzes?topic=arrays&difficulty=medium
Authorization: Bearer <token>
```

#### Submit Quiz Attempt
```http
POST /api/quizzes/:id/attempt
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    { "questionId": "q1", "answer": "A" },
    { "questionId": "q2", "answer": "B" }
  ]
}
```

### Interview Endpoints

#### Create Interview
```http
POST /api/interviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Google",
  "role": "Software Engineer",
  "date": "2024-12-20T10:00:00Z",
  "type": "technical"
}
```

For complete API documentation, visit: [API Docs](https://placement-prep-wa.onrender.com/api/docs)

---

## 🗂️ Project Structure

```
placement-prep/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/              # API service layer
│   │   ├── components/       # Reusable components
│   │   │   ├── common/       # Button, Input, Card, etc.
│   │   │   └── layout/       # Header, Sidebar, Layout
│   │   ├── pages/            # Page components
│   │   │   ├── Auth/         # Login, Signup
│   │   │   ├── Dashboard/    # Main dashboard
│   │   │   ├── Practice/     # Coding practice
│   │   │   ├── Interviews/   # Interview management
│   │   │   └── Quiz/         # Quiz player
│   │   ├── router/           # Route configuration
│   │   ├── store/            # Zustand state management
│   │   ├── utils/            # Helper functions
│   │   └── App.jsx           # Root component
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── env.js        # Environment variables
│   │   │   ├── database.js   # MongoDB connection
│   │   │   └── passport.js   # OAuth strategies
│   │   ├── controllers/      # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── oauthController.js
│   │   │   ├── quizController.js
│   │   │   └── interviewController.js
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Quiz.js
│   │   │   ├── Question.js
│   │   │   ├── Interview.js
│   │   │   └── Attempt.js
│   │   └── routes/           # API routes
│   │       ├── authRoutes.js
│   │       ├── quizRoutes.js
│   │       ├── questionRoutes.js
│   │       └── interviewRoutes.js
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth with HTTP-only cookies
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - Prevent brute force attacks
- **CORS Protection** - Configured origin whitelist
- **Helmet.js** - Security headers
- **Input Validation** - Express-validator for all inputs
- **MongoDB Injection Prevention** - express-mongo-sanitize
- **XSS Protection** - Sanitized user inputs

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 🐛 Known Issues

- [ ] Resume analysis feature in development
- [ ] Mobile responsive improvements needed
- [ ] Email verification pending implementation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Allen Pinto**

- GitHub: [@allenpinto](https://github.com/allenpinto)
- Email: pinto.allen05@gmail.com
- LinkedIn: [Allen Pinto](https://linkedin.com/in/allenpinto)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Express](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting
- [Lucide Icons](https://lucide.dev/) - Icon library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework

---

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Email: pinto.allen05@gmail.com
- Check the [API Documentation](https://placement-prep-wa.onrender.com/api/docs)

---

<div align="center">

**Made with ❤️ by Allen Pinto**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/allenpinto/placement-prep/issues) • [Request Feature](https://github.com/allenpinto/placement-prep/issues)

</div>
