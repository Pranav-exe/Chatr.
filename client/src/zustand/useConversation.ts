import { create } from "zustand";

export interface ConversationType {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  gender: "male" | "female";
  lastSeen: string;
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

  conversations: ConversationType[];
  setConversations: (conversations: ConversationType[]) => void;
  addConversation: (conversation: ConversationType) => void;
  updateConversation: (
    userId: string,
    updates: Partial<ConversationType>,
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

  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => {
      const exists = state.conversations.find(
        (c) => c._id === conversation._id,
      );
      if (exists) return state;
      return { conversations: [...state.conversations, conversation] };
    }),
  updateConversation: (userId, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === userId ? { ...c, ...updates } : c,
      ),
      selectedConversation:
        state.selectedConversation?._id === userId
          ? { ...state.selectedConversation, ...updates }
          : state.selectedConversation,
    })),

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
