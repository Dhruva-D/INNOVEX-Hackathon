# Food Donation Backend API

Backend API for the Food Donation application supporting three user types: Donors, Food Seekers, and Volunteers.

## Setup Instructions

1. Clone the repository
2. Navigate to the backend directory
   ```
   cd backend
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/fooddonation
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```
5. Start the server
   ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Authentication Routes

#### Register a New User
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "userType": "donor", // "donor", "foodSeeker", or "volunteer"
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "location": "New York, NY",
    // Additional fields based on user type
    // For Food Seekers
    "foodRequirements": "Vegetarian food",
    "familySize": 4,
    // For Volunteers
    "availability": "Weekends",
    "skills": ["Driving", "Cooking"]
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: 
    ```json
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "location": "New York, NY",
      "userType": "donor",
      "token": "jwt_token"
    }
    ```

#### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123",
    "userType": "donor" // "donor", "foodSeeker", or "volunteer"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "location": "New York, NY",
      "userType": "donor",
      "token": "jwt_token"
    }
    ```

#### Get User Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer your_token_here`
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "location": "New York, NY",
      "userType": "donor",
      // Additional fields based on user type
    }
    ```

## Error Handling

All routes return standardized error responses:

```json
{
  "message": "Error message here",
  "stack": "Error stack trace (only in development mode)"
}
```

Common HTTP status codes:
- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 404: Resource not found
- 500: Server error 