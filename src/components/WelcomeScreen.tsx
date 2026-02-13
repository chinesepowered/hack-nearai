"use client";

import { useState } from "react";
import { CategoryType } from "@/types";
import { getAllCategories } from "@/lib/categories";
import ChatInput from "./ChatInput";

interface WelcomeScreenProps {
  onStart: (category: CategoryType, message: string, file?: { name: string; content: string; size: string }) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType | null>(null);
  const categories = getAllCategories();
  const selected = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 pulse-ring" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Private &amp; Verified via NEAR AI TEE
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              What would you never ask ChatGPT?
            </h1>
            <p className="text-zinc-400 text-base max-w-lg mx-auto">
              Ask it here instead. Your prompts are encrypted and processed
              inside a Trusted Execution Environment. Nobody can see them —
              not even us.
            </p>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 stagger-children">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id,
                  )
                }
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.bgColor} ${cat.borderColor} ring-1 ring-current/10`
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span
                    className={`font-semibold text-sm ${selectedCategory === cat.id ? cat.color : "text-zinc-200"}`}
                  >
                    {cat.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {cat.description}
                </p>
              </button>
            ))}
          </div>

          {/* Starters for selected category */}
          {selected && (
            <div className="animate-fade-in mb-4">
              <div className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wider">
                Conversation starters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selected.starters.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => onStart(selected.id, starter)}
                    className={`text-left p-3 rounded-xl border ${selected.borderColor} ${selected.bgColor} hover:brightness-125 transition-all text-sm text-zinc-300 hover:text-white`}
                  >
                    &ldquo;{starter}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All starters when no category selected */}
          {!selected && (
            <div>
              <div className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wider">
                Or jump right in
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.starters[0]}
                    onClick={() => onStart(cat.id, cat.starters[0])}
                    className="text-left p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all text-sm text-zinc-400 hover:text-zinc-200"
                  >
                    <span className="mr-2">{cat.icon}</span>
                    &ldquo;{cat.starters[0]}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto w-full px-4 pb-4">
        <ChatInput
          onSend={(msg, file) =>
            onStart(selectedCategory || "general", msg, file)
          }
          isStreaming={false}
          onStop={() => {}}
          placeholder={
            selected
              ? `Ask about ${selected.name.toLowerCase()}...`
              : "Ask anything privately..."
          }
        />
      </div>
    </div>
  );
}
