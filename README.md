# Chime

Chime is a responsive, real-time chat application built with React, Express, MongoDB, and Socket.IO. The source code is written in TypeScript.

## Features

- User registration and JWT authentication
- User search and one-to-one conversations
- Group creation, renaming, membership management, and leaving
- Persistent messages stored in MongoDB
- Image messages uploaded from the chat composer and hosted through Cloudinary
- Real-time message delivery and typing indicators with Socket.IO
- Notifications for messages outside the selected chat
- Optional profile-picture upload through Cloudinary
- Responsive, full-height chat workspace with conversation previews, grouped message bubbles, date separators, timestamps, and a mobile-safe composer

## Architecture

```text
Firebase Hosting
React + TypeScript client
        │
        ├── HTTPS REST API
        └── Authenticated Socket.IO
                    │
              Render Web Service
          Express + TypeScript server
                    │
               MongoDB Atlas
```

HTTP requests and Socket.IO handshakes use the same JWT identity. The server verifies chat membership for messages and Socket.IO rooms, and it enforces group-administrator permissions independently of the UI.

## Technology

### Client

- React 18 and TypeScript
- Create React App
- Chakra UI
- React Router
- Axios
- Socket.IO Client
- Framer Motion

### Server

- Node.js and TypeScript
- Express
- Socket.IO
- MongoDB and Mongoose
- JSON Web Tokens
- bcryptjs

## Local development

### Requirements

- Node.js 18 or later
- npm
- A MongoDB deployment
- A Cloudinary upload preset if profile or chat image uploads are needed

### 1. Install server dependencies

```powershell
npm install
```

Create a root `.env` file:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-strong-secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

Never commit this file or expose its values.

Start the backend:

```powershell
npm run dev
```

### 2. Install client dependencies

```powershell
cd client
npm install --legacy-peer-deps
npm start
```

The development client uses the proxy in `client/package.json` for REST requests and defaults Socket.IO to `http://localhost:5000`.

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

### Server

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB driver connection string |
| `JWT_SECRET` | Yes | Signs and verifies authentication tokens |
| `PORT` | No | HTTP port; defaults to `5000` |
| `CLIENT_URL` | Production | Comma-separated browser origins allowed by CORS and Socket.IO |

### Client

Client variables are embedded during `npm run build` and are public configuration, not secrets.

| Variable | Required | Purpose |
| --- | --- | --- |
| `REACT_APP_API_URL` | Production | Render backend origin, without `/api` |
| `REACT_APP_SOCKET_URL` | No | Socket.IO origin; falls back to `REACT_APP_API_URL` |

See `client/.env.example`.

## Scripts and verification

From the repository root:

```powershell
npm run typecheck
npm test
npm run build
npm run dev
npm start
```

From `client/`:

```powershell
npx tsc --noEmit
npm test -- --watchAll=false
npm run build
npm start
```

The backend test suite covers HTTP boundaries and reusable chat-authorization rules. The frontend suite covers user-facing authentication behavior. The deployment workflow runs both suites before building or deploying.

The backend build output is `dist/server/`. The frontend build output is `client/build/`. Both directories are generated and ignored by Git.

## Production deployment

### Automatic deployment from GitHub

Every push to `master` runs `.github/workflows/deploy.yml`. The workflow verifies both applications, builds the client, and deploys it to Firebase Hosting. Render can deploy the backend automatically from the same push.

Configure these values once under **GitHub repository → Settings → Secrets and variables → Actions**:

| Kind | Name | Value |
| --- | --- | --- |
| Secret | `FIREBASE_SERVICE_ACCOUNT_MYCHAT_2CE41` | Firebase service-account JSON with Hosting deployment access |
| Variable | `REACT_APP_API_URL` | Production backend origin, without `/api` |
| Variable (optional) | `REACT_APP_SOCKET_URL` | Socket.IO origin when different from `REACT_APP_API_URL` |

The recommended way to create the Firebase service account is Firebase's GitHub integration setup (`firebase init hosting:github`). Store the generated JSON under the secret name above. Never commit the JSON key.

The workflow can also be started manually from the GitHub **Actions** tab. Local deployment commands remain available as a fallback.

### Backend on Render

Create a Render Web Service from the repository root:

```text
Build Command: npm ci --include=dev && npm run build
Start Command: npm start
```

Configure `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in Render. Add the service's Render outbound IP ranges to the MongoDB Atlas project IP access list.

The health endpoint is:

```text
GET /
```

It returns `API is running successfully` when the service is available.

### Frontend on Firebase Hosting

Create `client/.env` before building:

```env
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_SOCKET_URL=https://your-backend.onrender.com
```

Then deploy from `client/`:

```powershell
npm run build
npx firebase-tools login
npx firebase-tools deploy --only hosting --project mychat-2ce41
```

After changing a `REACT_APP_*` value, rebuild before deploying because Firebase Hosting cannot inject these values into an existing static bundle.

## Starting the first conversation

A new database has no chats. Register at least two users, sign in as one of them, select **Search User**, and choose the other user. The application creates or opens the direct conversation at that point.

A group requires the creator plus at least two other users.

## Project layout

```text
MyReactChat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   │   └── api.ts
│   │   ├── Context/
│   │   ├── Pages/
│   │   ├── theme.ts
│   │   └── types.ts
│   ├── firebase.json
│   └── tsconfig.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── domain/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── app.ts
│   └── server.ts
├── docs/agent-context/
├── AGENTS.md
└── tsconfig.json
```

## Security notes

- Keep `.env`, MongoDB credentials, and JWT secrets out of Git.
- Rotate credentials that were previously committed or deployed publicly.
- Do not place server secrets in `REACT_APP_*` variables.
- Restrict MongoDB Atlas network access to the required Render outbound ranges where practical.

## License

ISC, as declared in `package.json`.
