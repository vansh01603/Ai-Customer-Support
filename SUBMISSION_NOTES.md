# Submission Notes

## Project

**AI Customer Support Assistant**

This project was developed as a full-stack technical assessment demonstrating authentication, REST API development, database integration, order management, and AI-powered customer support.

## Implementation Approach

The application was divided into two main parts:

* `Client/` — React + Vite frontend
* `server/` — Node.js + Express backend

MongoDB is used as the persistent database.

The frontend communicates with the backend through REST APIs using Axios.

---

## Authentication

JWT authentication was selected because it provides a simple stateless authentication mechanism suitable for a REST API.

During registration:

1. The backend checks whether the email already exists.
2. The password is hashed using `bcryptjs`.
3. The new user is stored in MongoDB.

During login:

1. The user is searched by email.
2. The supplied password is compared with the stored hash.
3. A JWT containing the user's ID is generated.
4. The token is returned to the frontend.

The frontend stores the token and sends it with protected API requests.

---

## User Data Isolation

Orders and conversations are associated with a user through `userId`.

This was intentionally implemented so that authenticated users cannot access another user's private data.

For example, retrieving an order requires both:

```text
orderId
userId
```

rather than looking up the order using only its public order ID.

Chat history is also filtered by the authenticated user's ID.

---

## Order Design

A small fixed catalog was used to keep the assessment focused on the core functionality.

The current catalog contains:

* Wireless Mouse
* Mechanical Keyboard
* USB-C Hub
* Laptop Stand
* Noise Cancelling Headphones

When an order is created, the backend calculates the total amount using the server-side catalog price rather than trusting a price supplied by the frontend.

A unique order ID is generated for each order.

An estimated delivery date is also generated when the order is created.

---

## AI Customer Support

Google Gemini was selected as the AI provider.

The AI service receives:

```text
Customer message
+
Relevant order information
```

when an order is available.

The prompt instructs the AI to:

* Be friendly and concise.
* Use supplied order information.
* Avoid inventing order information.
* Explain when required information is unavailable.

This approach keeps application-specific facts in the backend/database instead of asking the AI model to generate them.

---

## Conversation Persistence

Each successful chat interaction is stored as one `Conversation` document.

The document contains:

```text
userId
orderId
message
reply
createdAt
updatedAt
```

This allows the application to display chat history for the authenticated user.

Mongoose timestamps are used instead of manually managing creation and update timestamps.

---

## Error Handling

The backend uses HTTP status codes to communicate common failures.

Examples:

```text
400 — Invalid request
401 — Authentication failure
404 — Resource not found
500 — Internal/server/AI failure
```

AI failures are caught before a conversation is stored, preventing unsuccessful responses from being persisted as valid chat messages.

---

## Frontend API Configuration

The frontend uses a centralized Axios instance:

```text
Client/src/api/axios.js
```

The backend URL is configured using:

```text
VITE_API_URL
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

For deployment, the production API URL can be supplied through the frontend hosting provider's environment variables.

This avoids hardcoding the production backend URL into individual components.

---

## Security Measures

The implementation includes:

* Password hashing with bcrypt.
* JWT-based authentication.
* Protected order and chat routes.
* User-specific database queries.
* Environment variables for secrets.
* `.gitignore` rules for `.env` files and dependencies.

No database credentials, JWT secrets, or Gemini API keys are intended to be committed to the repository.

---

## Testing / Verification

The application was manually verified through the main user flow:

```text
Registration
    ↓
Login
    ↓
Dashboard
    ↓
View Orders
    ↓
Place Order
    ↓
Chat
    ↓
Order-aware AI response
    ↓
Chat History
    ↓
Logout / Login
    ↓
Previous history available
```

Additional API error cases were considered for:

* Invalid login credentials
* Duplicate registration
* Missing authentication
* Invalid order ID
* Missing chat message
* AI service failure

---

## Deployment Plan

The application is structured for separate frontend and backend deployment.

### Frontend

The React/Vite application can be deployed to a static hosting platform such as Vercel.

The production backend URL is supplied using:

```text
VITE_API_URL
```

### Backend

The Express application can be deployed to a Node.js hosting platform such as Render.

The backend requires:

```text
PORT
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY
CLIENT_URL
```

MongoDB Atlas can be used as the hosted MongoDB database.

---

## Known Limitations

This implementation intentionally keeps the scope focused on the assessment requirements.

Current limitations include:

* Static product catalog.
* One catalog item per order.
* No payment processing.
* No admin order management.
* No real shipping/fulfillment integration.
* No refresh-token system.
* Limited automated test coverage.

These can be addressed in a production version.

---

## Final Notes

The project prioritizes:

1. Clear separation between frontend and backend.
2. Secure handling of user authentication.
3. User-specific data access.
4. Persistent order and conversation data.
5. AI responses grounded in available order information.
6. Environment-based configuration.
7. Simple and maintainable project structure.
