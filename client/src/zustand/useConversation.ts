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
  addMessage: (message: MessageType) => void;
  clearMessages: () => void;

  unreadCounts: { [key: string]: number };
  incrementUnreadCount: (senderId: string) => void;
  clearUnreadCount: (senderId: string) => void;

  typingUsers: string[];
  setTypingUser: (senderId: string) => void;
  removeTypingUser: (senderId: string) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessages: (messages) => set({ messages }),

  // ✅ SAFE real-time append
  addMessage: (message) =>
    set((state) => {
      const exists = state.messages.find((m) => m._id === message._id);
      if (exists) return state;
      return {
        messages: [...state.messages, message],
      };
    }),

  clearMessages: () => set({ messages: [] }),

  unreadCounts: {},

  incrementUnreadCount: (senderId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [senderId]: (state.unreadCounts[senderId] || 0) + 1,
      },
    })),

  clearUnreadCount: (senderId) =>
    set((state) => {
      const newUnreadCounts = { ...state.unreadCounts };
      delete newUnreadCounts[senderId];
      return { unreadCounts: newUnreadCounts };
    }),

  typingUsers: [],
  setTypingUser: (senderId) =>
    set((state) => ({
      typingUsers: state.typingUsers.includes(senderId)
        ? state.typingUsers
        : [...state.typingUsers, senderId],
    })),
  removeTypingUser: (senderId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((id) => id !== senderId),
    })),
}));

export default useConversation;
