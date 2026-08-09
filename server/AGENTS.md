# Backend specialist context

## Scope

This directory is an Express, Mongoose, JWT, and Socket.IO backend compiled from TypeScript to `dist/server`.

## Important paths

- `server/server.ts`: Express startup and authenticated Socket.IO wiring.
- `server/middleware/authMiddleware.ts`: HTTP bearer-token authentication.
- `server/controllers/chatControllers.ts`: one-to-one and group chat operations.
- `server/controllers/messageControllers.ts`: message history and sending.
- `server/models/`: Mongoose schemas.
- `server/routes/`: HTTP route registration.

## Backend invariants

- Never trust client-side authorization.
- Message history and sending require membership in the target chat.
- Group rename/add operations require the group admin.
- A member may leave a group; only the admin may remove another member.
- Socket.IO authenticates the handshake JWT and verifies room membership.
- Never return password hashes.
- Password hashing runs only when the password field is modified.
- Preserve meaningful HTTP status codes through error handling.

## Environment

Required secrets are supplied outside Git:

- `MONGO_URI`
- `JWT_SECRET`

Optional:

- `PORT` (defaults to 5000)
- `CLIENT_URL` (comma-separated allowed Socket.IO origins)

Do not read or print secret values during routine work.

## Verification

From the repository root, run:

```powershell
npm run typecheck
npm run build
```

