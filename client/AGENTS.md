# Frontend specialist context

## Scope

This directory is a Create React App frontend using React 18, TypeScript, Chakra UI, Axios, React Router, and Socket.IO Client.

## Important paths

- `src/Context/ChatProvider.tsx`: shared authenticated user, selected chat, chats, and notifications.
- `src/types.ts`: shared frontend domain shapes.
- `src/components/SingleChat.tsx`: messages, typing state, and Socket.IO lifecycle.
- `src/components/MyChats.tsx`: chat list fetching and selection.
- `src/components/Miscellaneous/SideDrawer.tsx`: user search, notifications, logout.
- `src/components/Miscellaneous/UpdateGroupChatModal.tsx`: group membership and rename UI.
- `src/config/ChatLogics.ts`: message alignment and sender helpers.

## Frontend invariants

- API calls use relative `/api` paths and bearer tokens from the current user.
- Socket.IO authenticates with `auth.token`.
- A message request sends `chatId: selectedChat._id`, never the whole chat object.
- Listener callbacks use functional state updates and are removed during effect cleanup.
- Local storage uses only the `userInfo` key; logout must not clear unrelated site storage.
- Encode user-entered search query parameters.

## Verification

Run:

```powershell
npx tsc --noEmit
npm run build
```

The production build may report dependency-age warnings; new source warnings should be fixed.

