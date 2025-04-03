# Food Donation Platform

A MERN stack application for connecting food donors, food seekers, and volunteers to facilitate food donation and distribution.

## Project Structure

```
/frontend  --> React frontend with user authentication
/backend   --> Node.js/Express backend with MongoDB
```

## Features

- Three types of users: Donors, Food Seekers, and Volunteers
- JWT-based authentication
- Secure password storage with bcrypt
- MongoDB database with Mongoose schemas
- RESTful API endpoints

## Backend Setup

1. Navigate to the backend directory
   ```
   cd backend
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the backend directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/fooddonation
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```
4. Start the backend server
   ```
   npm run dev
   ```
   
## Frontend Setup

1. Navigate to the root directory
2. Install frontend dependencies
   ```
   npm install
   ```
3. Start the frontend
   ```
   npm run dev
   ```

## API Documentation

See detailed API documentation in [backend/README.md](./backend/README.md).