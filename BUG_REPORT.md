# Bug Report

## Overview

During development and testing of the AI Customer Support Assistant, several issues were identified and resolved while connecting the React frontend with the Express/MongoDB backend and implementing authentication, orders, and AI chat functionality.

The following documents the main issues encountered during development and the corresponding fixes.

---

## Bug 1 — Registration and Login Requests Failing

### Problem

The frontend initially displayed messages such as:

```text
Registration failed
Login failed
```

when attempting to authenticate.

### Cause

The frontend authentication requests were not successfully communicating with the backend API during the initial integration.

### Fix

The frontend API communication was centralized through Axios:

```text
Client/src/api/axios.js
```

The API base URL is now configured through:

```text
VITE_API_URL
```

with a local development fallback:

```text
http://localhost:5000/api
```

Authentication requests use the centralized Axios instance instead of duplicating backend URLs throughout the components.

### Result

Registration and login requests successfully communicate with the backend.

---

## Bug 2 — Authentication Required for User-Specific Data

### Problem

Orders and conversations need to belong to the currently logged-in user.

Without authentication, it would be possible to expose data that does not belong to the requesting user.

### Fix

JWT authentication was implemented.

After login, the backend returns a JWT containing the user's ID.

Protected routes use authentication middleware to verify the token and expose the authenticated user's ID to controllers.

Orders are queried using both:

```text
orderId
```

and:

```text
userId
```

Similarly, chat history is retrieved using the authenticated user's ID.

### Result

Users can only access their own orders and conversations.

---

## Bug 3 — AI Could Potentially Answer Without Reliable Order Context

### Problem

An AI customer support assistant should not invent order details when answering questions about an order.

### Fix

When a chat request contains an `orderId`, the backend first looks up the order for the authenticated user.

The relevant order information is then passed to the AI service as context.

The prompt explicitly instructs the model:

* Use available order information.
* Do not invent order information.
* Clearly state when required information is unavailable.

### Result

Order-related questions are answered using application data instead of relying entirely on the model's assumptions.

---

## Bug 4 — Failed AI Requests Should Not Create Broken Conversations

### Problem

If the Gemini API fails, the application should not save an invalid conversation containing an unsuccessful AI response.

### Fix

The AI service throws an error when the Gemini request fails.

The chat controller catches the error and returns an HTTP `500` response.

The conversation is created only after a successful AI response is obtained.

### Result

Failed AI requests are returned as errors and are not stored as successful conversations.

---

## Bug 5 — Users Need Persistent Chat History

### Problem

Chat messages should not disappear when the user leaves the chat page.

### Fix

Each successful chat exchange is stored in the `Conversation` collection with:

* User ID
* Optional Order ID
* Customer message
* AI reply
* Automatic timestamps

Chat history is retrieved using the authenticated user's ID and sorted by creation time.

### Result

Users can return to the application and retrieve their previous conversations.

---

## Bug 6 — User Orders Must Be Isolated

### Problem

An order ID alone should not be sufficient to access another user's order.

### Fix

Order queries include both the requested order ID and the authenticated user's ID.

For example:

```text
orderId + userId
```

This prevents a logged-in user from retrieving another user's order simply by knowing its order ID.

### Result

Order data is scoped to the authenticated customer.

---

## Current Status

All documented issues have been addressed in the current implementation.

The remaining production-level considerations are documented in the main README under **Known Limitations** and **Future Improvements**.
