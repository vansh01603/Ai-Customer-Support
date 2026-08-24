# AI Customer Support Assistant

A full-stack AI-powered customer support application built for the Full Stack Developer Internship technical assessment.

The application allows customers to register and log in securely, view and place orders, and communicate with an AI customer support assistant. The chatbot can use authenticated order information to answer order-related questions and stores conversation history for each user.

## Features

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Protected order and chat APIs
* View previously placed orders
* Place new orders from a fixed product catalog
* Unique order IDs
* Estimated delivery dates
* AI-powered customer support using Google Gemini
* Order-aware AI responses
* Persistent chat history
* User-specific orders and conversations
* MongoDB database persistence
* Environment-based configuration
* CORS support for frontend/backend communication

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express 5
* MongoDB
* Mongoose
* JWT (`jsonwebtoken`)
* `bcryptjs`
* CORS
* Google Gemini via `@google/genai`

## Project Structure

```text
Ai-customer-support/
│
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Order.jsx
│   │   │   └── Chat.jsx
│   │   └── styles/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   └── chatController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Order.js
│   │   │   └── Conversation.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── chatRoutes.js
│   │   └── services/
│   │       └── aiService.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

## Application Flow

```text
User
 │
 ├── Register
 │      ↓
 │   User stored in MongoDB
 │
 ├── Login
 │      ↓
 │   JWT token generated
 │
 └── Dashboard
        │
        ├── My Orders
        │     ├── View Orders
        │     └── Place Order
        │
        └── Chat
              │
              ├── Send message
              ├── Optional Order ID
              ├── Gemini processes request
              └── Conversation saved
```

## Authentication

Registration creates a new user after checking whether the email already exists.

Passwords are never stored as plain text. They are hashed using `bcryptjs`.

After successful login, the backend generates a JWT containing the authenticated user's ID.

Protected endpoints require:

```text
Authorization: Bearer <token>
```

The authentication middleware verifies the token and attaches the user ID to the request.

## Data Modeling

The application uses three MongoDB collections.

### User

Stores:

* Name
* Email
* Hashed password

The email is unique.

### Order

Stores:

* Unique order ID
* User reference
* Order items
* Quantity
* Item price
* Total amount
* Order status
* Estimated delivery date

Orders are associated with the authenticated user, ensuring users can only access their own orders.

### Conversation

Stores:

* User reference
* Optional order ID
* Customer message
* AI reply
* Creation/update timestamps

Chat history is retrieved for the authenticated user and sorted chronologically.

## AI Integration

Google Gemini is used as the AI provider through the `@google/genai` SDK.

The backend constructs a prompt containing:

* The customer's message
* Relevant order information when an order is selected
* Instructions to avoid inventing unavailable order information

Example order context:

```text
Order ID: ORD1001
Status: pending
Total Amount: 499
Estimated Delivery: ...
Items: Wireless Mouse x1
```

The AI is instructed to use this information when answering order-related questions.

If no matching order information is available, the assistant is instructed not to invent it.

## API Documentation

The backend runs under `/api`.

### Authentication

| Method | Endpoint             | Body                        | Description                      |
| ------ | -------------------- | --------------------------- | -------------------------------- |
| POST   | `/api/auth/register` | `{ name, email, password }` | Register a new user              |
| POST   | `/api/auth/login`    | `{ email, password }`       | Authenticate user and return JWT |

### Orders

All order endpoints require authentication.

| Method | Endpoint               | Body                   | Description                         |
| ------ | ---------------------- | ---------------------- | ----------------------------------- |
| GET    | `/api/orders/catalog`  | —                      | Get available products              |
| POST   | `/api/orders`          | `{ itemId, quantity }` | Create an order                     |
| GET    | `/api/orders`          | —                      | Get the authenticated user's orders |
| GET    | `/api/orders/:orderId` | —                      | Get one authenticated user's order  |

### Chat

All chat endpoints require authentication.

| Method | Endpoint            | Body                    | Description                               |
| ------ | ------------------- | ----------------------- | ----------------------------------------- |
| POST   | `/api/chat`         | `{ message, orderId? }` | Send a message to the AI assistant        |
| GET    | `/api/chat/history` | —                       | Get the authenticated user's chat history |

## Environment Variables

### Backend

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

See:

```text
server/.env.example
```

### Frontend

Create `Client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

See:

```text
Client/.env.example
```

Environment files containing secrets are excluded from Git.

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ai-customer-support
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

Create `.env` using `.env.example` and provide the required values.

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd Client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on Vite's development server, normally:

```text
http://localhost:5173
```

## Frontend Configuration

API requests are centralized in:

```text
Client/src/api/axios.js
```

The application reads:

```text
VITE_API_URL
```

and falls back to:

```text
http://localhost:5000/api
```

for local development.

For deployment, the production frontend API URL can be supplied through the hosting platform's environment variables without changing the application source code.

## Error Handling

The API handles common application errors including:

* Duplicate user registration → `400`
* Invalid login credentials → `401`
* Missing/invalid authentication token → `401`
* Missing chat message → `400`
* Invalid product selection → `400`
* Order not found → `404`
* AI service failure → `500`
* Database/server failures → `500`

AI failures are caught by the chat controller so that an unsuccessful AI request does not create a broken conversation record.

## Security Considerations

* Passwords are hashed before being stored.
* JWT authentication protects private routes.
* Users can only access their own orders and conversations.
* API keys and database credentials are stored in environment variables.
* `.env` files are excluded from version control.
* `.env.example` files contain only placeholder values.

## Deployment

The application can be deployed as two services:

### Frontend

The React/Vite frontend can be deployed using Vercel or another static hosting provider.

Set:

```env
VITE_API_URL=https://<deployed-backend-url>/api
```

### Backend

The Express backend can be deployed using Render or another Node.js hosting provider.

Required backend environment variables:

```text
PORT
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY
CLIENT_URL
```

The backend must be deployed before configuring the frontend's production `VITE_API_URL`.

## Known Limitations

* The product catalog is currently static and defined in the backend.
* Orders are intentionally simple and contain one selected catalog item per order.
* Order status is currently stored as part of the order data rather than being managed through a separate fulfillment system.
* The AI assistant relies on the configured Gemini model and API availability.
* This project is designed as a technical assessment/demo application rather than a production-scale e-commerce platform.

## Future Improvements

Possible future improvements include:

* Admin dashboard for order management
* Real order status updates
* Multiple items in a single order
* Payment integration
* Refresh-token based authentication
* Rate limiting
* Input validation with a dedicated validation library
* More comprehensive automated tests
* Streaming AI responses
* Better conversation/thread management
* Production logging and monitoring

## License

This project was created for a Full Stack Developer Internship technical assessment.
