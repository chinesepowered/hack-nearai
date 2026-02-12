"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  isStreaming,
  onStop,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (!isStreaming) {
      textareaRef.current?.focus();
    }
  }, [isStreaming]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2 p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 focus-within:border-zinc-600 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isStreaming}
          rows={1}
          className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 resize-none outline-none text-sm leading-relaxed max-h-[200px]"
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
            title="Stop generating"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black transition-colors"
            title="Send message"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-[10px] text-zinc-600">
          Encrypted via NEAR AI TEE · Stored only in your browser
        </p>
        <p className="text-[10px] text-zinc-600">
          <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-500 font-mono">
            Enter
          </kbd>{" "}
          send ·{" "}
          <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-500 font-mono">
            Shift+Enter
          </kbd>{" "}
          newline
        </p>
      </div>
    </div>
  );
}
