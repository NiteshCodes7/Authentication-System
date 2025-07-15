# Auth App

A simple authentication application built with Node.js, Express, and MongoDB. This project demonstrates user registration, login, and protected routes using JWT-based authentication.

## Features

- User registration with email and password
- Secure password hashing
- User login with JWT token generation
- Protected API routes
- Error handling and validation

## Technologies Used

- Node.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB instance (local or cloud)

### Installation

```bash
git clone https://github.com/yourusername/auth-app.git
cd auth-app
npm install
```

### Configuration

Create a `.env` file in the root directory and add:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the App

```bash
npm run dev
```

The server will run on `http://localhost:3000`.

## API Endpoints

- `POST /api/register` — Register a new user
- `POST /api/login` — Login and receive JWT token
- `GET /api/protected` — Access protected route (requires JWT)

## License

MIT

## Author

Nitesh