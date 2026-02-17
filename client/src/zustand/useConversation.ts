import { create } from "zustand";

export interface ConversationType {
  _id: string;
  fullName: string;
  profilePic: string;
}

export interface MessageType {
  _id: string;
  senderId: string;
  message: string;
  createdAt: string;
  shouldShake?: boolean;
}

interface ConversationState {
  selectedConversation: ConversationType | null;
  setSelectedConversation: (
    selectedConversation: ConversationType | null,
  ) => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
