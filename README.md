# AI Support Chat API

A backend API for a support chat system with AI replies and basic admin control.

## Description

This project was built as a learning project to practice backend development, authentication, and AI integration.

## Features

- User registration and login
- JWT authentication
- User and admin roles
- Create support chats
- Send messages in chats
- Automatic AI replies using Groq API
- Get chat message history
- Enable or disable AI for a specific chat
- Update global AI system prompt
- MongoDB database integration

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Groq API

## Project Structure

```bash
src/
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
  app.js
  server.js
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key
```

## Installation

```bash
git clone https://github.com/tutuu9/ai-support-chat-api.git
cd ai-support-chat-api
npm install
```

## Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Auth

#### Register
`POST /api/auth/register`

```json
{
  "name": "Jan",
  "email": "jan@example.com",
  "password": "123456"
}
```

#### Login
`POST /api/auth/login`

```json
{
  "email": "jan@example.com",
  "password": "123456"
}
```

#### Get Current User
`GET /api/auth/me`

Headers:
```http
Authorization: Bearer YOUR_TOKEN
```

---

### Chats

#### Create Chat
`POST /api/chats`

Headers:
```http
Authorization: Bearer YOUR_TOKEN
```

Body:
```json
{
  "title": "Problem with my order"
}
```

#### Update AI Status For Chat
`PATCH /api/chats/:chatId/ai-settings`

Headers:
```http
Authorization: Bearer YOUR_TOKEN
```

Body:
```json
{
  "aiEnabled": false
}
```

---

### Messages

#### Send Message
`POST /api/messages`

Headers:
```http
Authorization: Bearer YOUR_TOKEN
```

Body:
```json
{
  "chatId": "CHAT_ID",
  "text": "Hello, I need help with my order"
}
```

#### Get Messages By Chat
`GET /api/messages/:chatId/messages`

Headers:
```http
Authorization: Bearer YOUR_TOKEN
```

---

### AI Settings

#### Update Global System Prompt
`PATCH /api/ai-settings/system-prompt`

Headers:
```http
Authorization: Bearer YOUR_TOKEN
```

Body:
```json
{
  "systemPrompt": "You are a helpful support assistant. Answer briefly and clearly."
}
```

## AI Logic

The API uses Groq to generate AI replies.

Flow:

1. User sends a message
2. Message is saved in MongoDB
3. Chat history is collected
4. AI generates a reply
5. AI reply is saved as a new message

## Roles

### User
- Create chats
- Send messages
- View own chat messages

### Admin
- Access protected admin functionality
- Update AI settings
- Update global system prompt

## Notes

- AI replies can be enabled or disabled per chat
- Global system prompt is stored in the database
- JWT is required for protected routes

## Future Improvements

- Assign admin to chat
- Open/close chat status management
- Admin dashboard endpoints
- Smarter AI context handling
- Better validation and error handling

## Author

TUTUU9

