"use client";

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";

interface FileAttachment {
  name: string;
  content: string;
  size: string;
}

interface ChatInputProps {
  onSend: (message: string, file?: FileAttachment) => void;
  isStreaming: boolean;
  onStop: () => void;
  placeholder?: string;
}

const ACCEPTED_TYPES = ".txt,.csv,.json,.md,.log,.xml,.html,.yml,.yaml,.toml";
const MAX_FILE_SIZE = 100 * 1024; // 100KB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function ChatInput({
  onSend,
  isStreaming,
  onStop,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<FileAttachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > MAX_FILE_SIZE) {
      alert(`File too large. Maximum size is ${formatBytes(MAX_FILE_SIZE)}.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFile({
        name: f.name,
        content: reader.result as string,
        size: formatBytes(f.size),
      });
    };
    reader.readAsText(f);

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleSend = () => {
    if ((!input.trim() && !file) || isStreaming) return;
    onSend(input.trim(), file || undefined);
    setInput("");
    setFile(null);
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
      {/* File attachment preview */}
      {file && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 animate-fade-in">
          <svg
            className="w-4 h-4 text-emerald-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          <span className="text-xs text-zinc-300 truncate">{file.name}</span>
          <span className="text-[10px] text-zinc-500">{file.size}</span>
          <button
            onClick={() => setFile(null)}
            className="ml-auto shrink-0 p-0.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 focus-within:border-zinc-600 transition-colors">
        {/* File upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 disabled:opacity-30 transition-colors"
          title="Attach file (.txt, .csv, .json, .md)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

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
            disabled={!input.trim() && !file}
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
