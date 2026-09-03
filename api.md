# API Endpoints Documentation

This document provides a comprehensive list of all API endpoints available in the backend services.

---

## 1. Authentication (`/auth`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | No | Register a new user account |
| `POST` | `/auth/login` | No | Log in with email and password |
| `GET` | `/auth/me` | Yes | Get authenticated user's basic info |

---

## 2. Profile (`/profile`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile/me` | Yes | Get full profile of current authenticated user |
| `PATCH` | `/profile/me` | Yes | Update current user's profile |
| `GET` | `/profile/:userId` | Yes | Get public profile details for a specific user |

---

## 3. Events (`/events`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | Optional | Retrieve paginated list of events with filters |
| `GET` | `/events/:id` | Optional | Get detailed information for a specific event |
| `POST` | `/events` | Yes | Create a new event |
| `PATCH` | `/events/:id` | Yes | Update an existing event |
| `DELETE` | `/events/:id` | Yes | Delete an event |

---

## 4. Event Interest (`/events/:eventId/interested`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/events/:eventId/interested` | Yes | Mark current user as interested in an event |
| `DELETE` | `/events/:eventId/interested` | Yes | Remove interest from an event |
| `GET` | `/events/:eventId/interested` | Yes | Get list of interested users for an event |

---

## 5. Teams (`/teams` & `/events/:eventId/teams`)

### Event Team Management

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/events/:eventId/teams` | Yes | Get all teams for a specific event |
| `POST` | `/events/:eventId/teams` | Yes | Create a new team for an event |

### Team Details & Join Requests

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/teams/:teamId` | Yes | Get team details |
| `POST` | `/teams/:teamId/join` | Yes | Submit a request to join a team |
| `GET` | `/teams/:teamId/requests` | Yes | Get all join requests for a team (Leader only) |
| `PATCH` | `/teams/:teamId/requests/:requestId/accept` | Yes | Accept a join request (Leader only) |
| `PATCH` | `/teams/:teamId/requests/:requestId/reject` | Yes | Reject a join request (Leader only) |

---

## 6. Notifications (`/notifications`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | Yes | Retrieve all notifications for current user |
| `GET` | `/notifications/unread-count` | Yes | Get count of unread notifications |
| `PATCH` | `/notifications/read-all` | Yes | Mark all notifications as read |
| `PATCH` | `/notifications/:notificationId/read` | Yes | Mark a specific notification as read |
