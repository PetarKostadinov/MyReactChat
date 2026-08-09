# Architecture reference

Read this only for cross-cutting work or when a flow is unclear.

## Runtime map

```text
React client
  ├─ REST /api/user    → authentication and user search
  ├─ REST /api/chat    → chat creation, listing, and group changes
  ├─ REST /api/message → message history and sending
  └─ Socket.IO + JWT   → typing and new-message delivery
             │
Express + Socket.IO server
  └─ Mongoose → MongoDB (User, Chat, Message)
```

## Authentication flow

Registration or login returns a user payload containing a JWT. The client stores it under `localStorage.userInfo`. Axios sends it as `Authorization: Bearer <token>`. Socket.IO sends the same token in the handshake `auth.token`.

## Message flow

1. The client posts `{ content, chatId }` to `/api/message`.
2. The server verifies that the authenticated user belongs to the chat.
3. The server creates and populates the message and updates `Chat.latestMessage`.
4. The sender emits `new message` through Socket.IO.
5. The server verifies the socket sender and distributes `message recieved` to other chat members.
6. The receiving client appends the message or creates a notification.

The misspelled event string `message recieved` is currently part of the internal protocol. Change both server and client together if correcting it.

## Group authorization

| Action | Allowed actor |
| --- | --- |
| Rename group | Group admin |
| Add member | Group admin |
| Remove another member | Group admin |
| Leave group | That member |

## Deployment boundaries

- Backend output: `dist/server/`
- Frontend output: `client/build/`
- Secrets: local/deployment environment only; `.env` is ignored
- Frontend API origin: `REACT_APP_API_URL` at build time
- Frontend Socket.IO origin: `REACT_APP_SOCKET_URL`, falling back to `REACT_APP_API_URL`
- Backend allowed browser origins: `CLIENT_URL` (comma-separated)
