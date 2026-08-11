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
  updatedAt?: string;
}

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt?: string;
  updatedAt?: string;
}

export interface RefreshChatsProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}
