# MERN Stack Project

A complete MERN (MongoDB, Express, React, Node.js) stack application with frontend and backend folder structure.

## Project Structure

```
├── backend/             # Node.js backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Middleware functions
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   ├── package.json     # Backend dependencies
│   └── server.js        # Express server
│
├── frontend/            # React frontend
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── screens/     # Screen components
│   │   ├── redux/       # Redux state management
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json     # Frontend dependencies
│
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd frontend
npm install
```

### Running the application

1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend development server
```
cd frontend
npm start
```

The application will be available at http://localhost:3000, and the backend API at http://localhost:5000.

## Features

- User authentication (login/register)
- JWT authentication
- Protected routes
- User profile management
- Redux state management
- Bootstrap UI
