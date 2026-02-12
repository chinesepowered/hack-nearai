import { Conversation } from "@/types";

const STORAGE_KEY = "undox_conversations";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function exportConversations(conversations: Conversation[]): void {
  const data = JSON.stringify(conversations, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `undox-export-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportConversation(conversation: Conversation): void {
  const data = JSON.stringify(conversation, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = conversation.title
    .slice(0, 30)
    .replace(/[^a-zA-Z0-9]/g, "-");
  a.download = `undox-${safeName}-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportConversationAsText(conversation: Conversation): void {
  let text = `# ${conversation.title}\n`;
  text += `Category: ${conversation.category}\n`;
  text += `Date: ${new Date(conversation.createdAt).toLocaleString()}\n`;
  text += `---\n\n`;

  for (const msg of conversation.messages) {
    const role = msg.role === "user" ? "You" : "AI";
    text += `**${role}** (${new Date(msg.timestamp).toLocaleTimeString()}):\n`;
    text += `${msg.content}\n\n`;
  }

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = conversation.title
    .slice(0, 30)
    .replace(/[^a-zA-Z0-9]/g, "-");
  a.download = `undox-${safeName}-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getStorageStats(conversations: Conversation[]) {
  const totalMessages = conversations.reduce(
    (sum, c) => sum + c.messages.length,
    0,
  );
  const data = JSON.stringify(conversations);
  const bytes = new Blob([data]).size;
  let size: string;
  if (bytes < 1024) size = `${bytes} B`;
  else if (bytes < 1024 * 1024) size = `${(bytes / 1024).toFixed(1)} KB`;
  else size = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return {
    conversationCount: conversations.length,
    messageCount: totalMessages,
    storageUsed: size,
  };
}
