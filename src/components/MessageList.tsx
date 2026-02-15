"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  statusMessage?: string | null;
}

function UserMessage({ message }: { message: Message }) {
  const fileMatch = message.content.match(/^\[(.+?\.\w+)\]\s*/);
  const fileName = fileMatch?.[1];
  const textContent = fileMatch
    ? message.content.slice(fileMatch[0].length)
    : message.content;

  return (
    <div className="flex justify-end animate-fade-in">
      <div className="max-w-[80%]">
        {fileName && (
          <div className="flex justify-end mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700/50 text-[11px] text-zinc-300">
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {fileName}
            </span>
          </div>
        )}
        <div className="px-4 py-3 rounded-2xl rounded-br-md bg-emerald-500/10 border border-emerald-500/20 text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap">
          {textContent || fileName}
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({
  content,
  isLive,
}: {
  content: string;
  isLive?: boolean;
}) {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[85%]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span className="text-[11px] text-zinc-500 font-medium">
            UNDOX · Private Response
          </span>
        </div>
        <div
          className={`prose-chat text-sm ${isLive ? "typing-cursor" : ""}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default function MessageList({
  messages,
  streamingContent,
  isStreaming,
  statusMessage,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingContent]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <AssistantMessage key={msg.id} content={msg.content} />
          ),
        )}
        {isStreaming && streamingContent && (
          <AssistantMessage content={streamingContent} isLive />
        )}
        {isStreaming && !streamingContent && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-bounce ${statusMessage ? "bg-amber-400" : "bg-zinc-500"}`}
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-bounce ${statusMessage ? "bg-amber-400" : "bg-zinc-500"}`}
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-bounce ${statusMessage ? "bg-amber-400" : "bg-zinc-500"}`}
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className={`text-xs ${statusMessage ? "text-amber-400/80" : "text-zinc-500"}`}>
                {statusMessage || "Thinking privately..."}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
