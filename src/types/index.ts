export type CategoryType =
  | "crypto"
  | "health"
  | "financial"
  | "personal"
  | "general";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  category: CategoryType;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  systemPrompt: string;
  starters: string[];
}
