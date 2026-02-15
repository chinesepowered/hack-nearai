"use client";

import { useState } from "react";

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  onCancel?: () => void;
}

export default function ApiKeyModal({ onSave, onCancel }: ApiKeyModalProps) {
  const [key, setKey] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">NEAR AI API Key</h2>
            <p className="text-xs text-zinc-500">Stored locally in your browser only</p>
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-4">
          Enter your NEAR AI API key to start chatting. Your key stays in your browser and connects directly to NEAR AI — it never touches any server.
        </p>

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your NEAR AI API key..."
          className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 mb-3"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && key.trim()) onSave(key.trim());
          }}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() => key.trim() && onSave(key.trim())}
            disabled={!key.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            Save &amp; Start Chatting
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <a
            href="https://cloud.near.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Get your free API key at cloud.near.ai
          </a>
        </div>
      </div>
    </div>
  );
}
