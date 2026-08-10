export interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
  token?: string;
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin?: User;
  latestMessage?: Message;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
}

export interface RefreshChatsProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}
