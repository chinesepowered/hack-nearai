"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Conversation, Message, CategoryType } from "@/types";
import {
  loadConversations,
  saveConversations,
  purgeExpired,
  formatTimeRemaining,
} from "@/lib/storage";
import {
  detectAddresses,
  fetchMultipleWallets,
  formatWalletContext,
} from "@/lib/wallet";
import Sidebar from "@/components/Sidebar";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import PrivacyBadge from "@/components/PrivacyBadge";
import ApiKeyModal from "@/components/ApiKeyModal";

interface FileAttachment {
  name: string;
  content: string;
  size: string;
}

const STORAGE_KEY = "undox_near_ai_key";

const PURGE_OPTIONS = [
  { label: "No auto-delete", value: null },
  { label: "1 hour", value: 3600000 },
  { label: "24 hours", value: 86400000 },
  { label: "7 days", value: 604800000 },
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [showPurgeMenu, setShowPurgeMenu] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // API key state
  const [apiKeySource, setApiKeySource] = useState<"server" | "local" | null>(null);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    async function checkApiKey() {
      try {
        const res = await fetch("/api/config");
        const config = await res.json();

        if (config.hasServerKey) {
          setApiKeySource("server");
          return;
        }
      } catch {
        // Server config unavailable — check localStorage
      }

      // No server key — check localStorage
      const storedKey = localStorage.getItem(STORAGE_KEY);
      if (storedKey) {
        setUserApiKey(storedKey);
        setApiKeySource("local");
      } else {
        setShowApiKeyModal(true);
      }
    }

    checkApiKey();
  }, []);

  // Load from localStorage + purge expired
  useEffect(() => {
    const convs = loadConversations();
    const purged = purgeExpired(convs);
    setConversations(purged);
    if (purged.length !== convs.length) {
      saveConversations(purged);
    }
    setLoaded(true);
  }, []);

  // Periodically check for expired conversations
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      setConversations((prev) => {
        const purged = purgeExpired(prev);
        if (purged.length !== prev.length) {
          saveConversations(purged);
          return purged;
        }
        return prev;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [loaded]);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (loaded) {
      saveConversations(conversations);
    }
  }, [conversations, loaded]);

  const handleSaveApiKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setUserApiKey(key);
    setApiKeySource("local");
    setShowApiKeyModal(false);
  }, []);

  const handleChangeApiKey = useCallback(() => {
    setShowApiKeyModal(true);
  }, []);

  const handleClearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUserApiKey(null);
    setApiKeySource(null);
    setShowApiKeyModal(true);
  }, []);

  const currentConversation =
    conversations.find((c) => c.id === currentId) || null;

  // Enrich message with wallet data + file content for the API
  const enrichMessage = useCallback(
    async (
      content: string,
      category: CategoryType,
      file?: FileAttachment,
    ): Promise<{ display: string; api: string }> => {
      let display = content;
      let api = content;

      // Attach file content (display shows filename, API gets full content)
      if (file) {
        display = file.name
          ? `[${file.name}] ${content}`
          : content;
        api = `[Attached file: ${file.name}]\n${file.content}\n---\n${content}`;
      }

      // Detect and fetch wallet data for crypto category
      if (category === "crypto") {
        const addresses = detectAddresses(content);
        if (addresses.length > 0) {
          setStatusMessage(
            `Fetching wallet data for ${addresses.map((a) => a.address.slice(0, 10) + "...").join(", ")}`,
          );
          try {
            const wallets = await fetchMultipleWallets(addresses);
            const walletContext = formatWalletContext(wallets);
            api = walletContext + "\n" + api;
          } catch {
            // If wallet fetch fails, proceed without data
          }
          setStatusMessage(null);
        }
      }

      return { display, api };
    },
    [],
  );

  // Stream via /api/chat route (passes user key when no server key)
  const streamChat = useCallback(
    async (
      messages: { role: string; content: string }[],
      category: CategoryType,
      signal: AbortSignal,
    ): Promise<string> => {
      const body: Record<string, unknown> = { messages, category };
      // Pass user's key to the server proxy when using localStorage key
      if (apiKeySource === "local" && userApiKey) {
        body.apiKey = userApiKey;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({
          error: "Unknown error",
        }));
        if (response.status === 401 || err.error === "NO_API_KEY") {
          // Invalid or missing key — clear and prompt again
          localStorage.removeItem(STORAGE_KEY);
          setUserApiKey(null);
          setApiKeySource(null);
          setShowApiKeyModal(true);
          throw new Error("Invalid API key. Please enter a valid key.");
        }
        throw new Error(err.error || "Failed to get response");
      }

      let fullContent = "";
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            if (line === "data: [DONE]") continue;
            try {
              const data = JSON.parse(line.slice(6));
              fullContent += data.content;
              setStreamingContent(fullContent);
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      if (buffer.startsWith("data: ") && buffer !== "data: [DONE]") {
        try {
          const data = JSON.parse(buffer.slice(6));
          fullContent += data.content;
        } catch {
          // skip
        }
      }

      return fullContent;
    },
    [apiKeySource, userApiKey],
  );

  const streamResponse = useCallback(
    async (
      convId: string,
      messages: { role: string; content: string }[],
      category: CategoryType,
    ) => {
      setIsStreaming(true);
      setStreamingContent("");

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let fullContent = "";

      try {
        fullContent = await streamChat(
          messages,
          category,
          abortController.signal,
        );

        if (fullContent.trim()) {
          const assistantMsg: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: fullContent,
            timestamp: Date.now(),
          };

          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: [...c.messages, assistantMsg],
                    updatedAt: Date.now(),
                  }
                : c,
            ),
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          if (fullContent.trim()) {
            const partialMsg: Message = {
              id: crypto.randomUUID(),
              role: "assistant",
              content: fullContent,
              timestamp: Date.now(),
            };
            setConversations((prev) =>
              prev.map((c) =>
                c.id === convId
                  ? {
                      ...c,
                      messages: [...c.messages, partialMsg],
                      updatedAt: Date.now(),
                    }
                  : c,
              ),
            );
          }
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong";
        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Something went wrong: ${errorMessage}. Please try again.`,
          timestamp: Date.now(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: [...c.messages, errorMsg],
                  updatedAt: Date.now(),
                }
              : c,
          ),
        );
      } finally {
        setIsStreaming(false);
        setStreamingContent("");
        setStatusMessage(null);
        abortControllerRef.current = null;
      }
    },
    [streamChat],
  );

  const startNewChat = useCallback(
    async (
      category: CategoryType,
      firstMessage: string,
      file?: FileAttachment,
    ) => {
      const id = crypto.randomUUID();
      const { display, api } = await enrichMessage(
        firstMessage,
        category,
        file,
      );

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: display,
        timestamp: Date.now(),
      };

      const newConv: Conversation = {
        id,
        title:
          firstMessage.length > 60
            ? firstMessage.slice(0, 57) + "..."
            : firstMessage,
        category,
        messages: [userMsg],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setConversations((prev) => [newConv, ...prev]);
      setCurrentId(id);

      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }

      streamResponse(id, [{ role: "user", content: api }], category);
    },
    [enrichMessage, streamResponse],
  );

  const handleSend = useCallback(
    async (
      content: string,
      file?: FileAttachment,
    ) => {
      if ((!content.trim() && !file) || isStreaming || !currentId || !currentConversation)
        return;

      const { display, api } = await enrichMessage(
        content,
        currentConversation.category,
        file,
      );

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: display,
        timestamp: Date.now(),
      };

      const apiMessages = [
        ...currentConversation.messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: api },
      ];

      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentId
            ? {
                ...c,
                messages: [...c.messages, userMsg],
                updatedAt: Date.now(),
              }
            : c,
        ),
      );

      streamResponse(currentId, apiMessages, currentConversation.category);
    },
    [currentId, currentConversation, isStreaming, enrichMessage, streamResponse],
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleNewChat = useCallback(() => {
    setCurrentId(null);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentId === id) {
        setCurrentId(null);
      }
    },
    [currentId],
  );

  const handleDeleteAll = useCallback(() => {
    setConversations([]);
    setCurrentId(null);
  }, []);

  const setExpiry = useCallback(
    (value: number | null) => {
      if (!currentId) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentId
            ? {
                ...c,
                expiresAt: value ? Date.now() + value : null,
              }
            : c,
        ),
      );
      setShowPurgeMenu(false);
    },
    [currentId],
  );

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex items-center gap-3 text-zinc-500">
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal
          onSave={handleSaveApiKey}
          onCancel={apiKeySource ? () => setShowApiKeyModal(false) : undefined}
        />
      )}

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          conversations={conversations}
          currentId={currentId}
          onSelect={(id) => {
            setCurrentId(id);
            if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
          apiKeySource={apiKeySource}
          onChangeApiKey={handleChangeApiKey}
          onClearApiKey={handleClearApiKey}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentConversation ? (
          <>
            {/* Top bar */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
              <div className="md:pl-0 pl-10">
                <PrivacyBadge category={currentConversation.category} />
              </div>
              <div className="flex items-center gap-3">
                {/* Auto-purge timer */}
                <div className="relative">
                  <button
                    onClick={() => setShowPurgeMenu(!showPurgeMenu)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      currentConversation.expiresAt
                        ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                    }`}
                    title="Auto-delete timer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentConversation.expiresAt
                      ? formatTimeRemaining(currentConversation.expiresAt)
                      : "Auto-delete"}
                  </button>

                  {showPurgeMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowPurgeMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 z-20 w-44 py-1 rounded-xl bg-zinc-800 border border-zinc-700 shadow-xl animate-fade-in">
                        <div className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                          Self-destruct timer
                        </div>
                        {PURGE_OPTIONS.map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => setExpiry(opt.value)}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                              (opt.value === null && !currentConversation.expiresAt)
                                ? "text-emerald-400 bg-emerald-500/5"
                                : "text-zinc-300 hover:bg-zinc-700/50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <span className="text-xs text-zinc-600">
                  {currentConversation.messages.length} messages
                </span>
              </div>
            </header>

            {/* Messages */}
            <MessageList
              messages={currentConversation.messages}
              streamingContent={streamingContent}
              isStreaming={isStreaming}
              statusMessage={statusMessage}
            />

            {/* Input */}
            <div className="max-w-3xl mx-auto w-full px-4 pb-4">
              <ChatInput
                onSend={handleSend}
                isStreaming={isStreaming}
                onStop={stopStreaming}
                placeholder={`Message (${currentConversation.category})...`}
              />
            </div>
          </>
        ) : (
          <WelcomeScreen onStart={startNewChat} />
        )}
      </div>
    </div>
  );
}
