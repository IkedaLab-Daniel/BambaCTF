# BambaCTF Server - Authentication Setup

## Setup

1. Make sure MongoDB is running on your system
2. Install dependencies: `npm install`
3. Update `.env` file with your own JWT_SECRET
4. Start the server: `npm run dev` (with auto-reload) or `npm start`

## API Endpoints

### Register
**POST** `/api/auth/register`

Request body:
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "fullName": "John Doe",
    "username": "johndoe"
  }
}
```

### Login
**POST** `/api/auth/login`

Request body:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "fullName": "John Doe",
    "username": "johndoe"
  }
}
```

## Protected Routes

To create protected routes, use the `authMiddleware`:

```javascript
import { authMiddleware } from './middleware/auth.js'

router.get('/protected', authMiddleware, (req, res) => {
  // req.user contains { userId, username }
  res.json({ message: 'Protected data', user: req.user })
})
```

## Client Usage

Store the token in localStorage and include it in requests:

```javascript
// After login/register
localStorage.setItem('token', response.token)

// In API requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```
