"use client";

import { useState } from "react";
import { Conversation } from "@/types";
import { getCategory } from "@/lib/categories";
import {
  exportConversations,
  exportConversation,
  getStorageStats,
} from "@/lib/storage";

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

function groupByDate(conversations: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 days", items: [] },
    { label: "Older", items: [] },
  ];

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt);
    if (date >= today) groups[0].items.push(conv);
    else if (date >= yesterday) groups[1].items.push(conv);
    else if (date >= weekAgo) groups[2].items.push(conv);
    else groups[3].items.push(conv);
  }

  return groups.filter((g) => g.items.length > 0);
}

export default function Sidebar({
  conversations,
  currentId,
  onSelect,
  onNewChat,
  onDelete,
  onDeleteAll,
}: SidebarProps) {
  const [showDataPanel, setShowDataPanel] = useState(false);
  const groups = groupByDate(conversations);
  const stats = getStorageStats(conversations);

  return (
    <div className="flex flex-col h-full bg-zinc-900/80 border-r border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
              <svg
                className="w-3.5 h-3.5 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">UNDOX</span>
          </a>
        </div>
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-sm font-medium text-zinc-200 transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New private chat
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2">
        {groups.length === 0 && (
          <div className="px-3 py-8 text-center">
            <div className="text-zinc-600 text-sm">No conversations yet</div>
            <div className="text-zinc-700 text-xs mt-1">
              Start a private chat above
            </div>
          </div>
        )}
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-3 py-1.5 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              {group.label}
            </div>
            {group.items.map((conv) => {
              const cat = getCategory(conv.category);
              const isActive = conv.id === currentId;
              return (
                <div
                  key={conv.id}
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                  onClick={() => onSelect(conv.id)}
                >
                  <span className="text-xs shrink-0">{cat.icon}</span>
                  <span className="text-sm truncate flex-1">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded hover:bg-zinc-700 text-zinc-500 hover:text-red-400 transition-all"
                    title="Delete conversation"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: Data management */}
      <div className="border-t border-zinc-800 p-3">
        <button
          onClick={() => setShowDataPanel(!showDataPanel)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
              />
            </svg>
            Your Data
          </div>
          <span className="text-xs text-zinc-600">{stats.storageUsed}</span>
        </button>

        {showDataPanel && (
          <div className="mt-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 animate-fade-in">
            <div className="grid grid-cols-2 gap-2 mb-3 text-center">
              <div className="p-2 rounded-lg bg-zinc-900/50">
                <div className="text-lg font-semibold text-white">
                  {stats.conversationCount}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase">Chats</div>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/50">
                <div className="text-lg font-semibold text-white">
                  {stats.messageCount}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase">
                  Messages
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => exportConversations(conversations)}
                disabled={conversations.length === 0}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export all data (JSON)
              </button>
              {currentId && (
                <button
                  onClick={() => {
                    const conv = conversations.find(
                      (c) => c.id === currentId,
                    );
                    if (conv) exportConversation(conv);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Export current chat
                </button>
              )}
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete ALL conversations? This cannot be undone.",
                    )
                  ) {
                    onDeleteAll();
                  }
                }}
                disabled={conversations.length === 0}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete all data
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-700/50">
              <p className="text-[10px] text-zinc-600 leading-relaxed">
                All data is stored locally in your browser. Nothing is persisted
                on any server. You own your data completely — export it, delete
                it, or close the tab.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
