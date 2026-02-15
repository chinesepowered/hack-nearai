"use client";

import { useState } from "react";
import { CategoryType } from "@/types";
import { getCategory } from "@/lib/categories";

export default function PrivacyBadge({
  category,
}: {
  category?: CategoryType;
}) {
  const [expanded, setExpanded] = useState(false);
  const cat = category ? getCategory(category) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors text-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 pulse-ring" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-emerald-400 font-medium">
          Private &amp; Verified
        </span>
        {cat && (
          <>
            <span className="text-zinc-600">·</span>
            <span className={cat.color}>{cat.icon} {cat.name}</span>
          </>
        )}
        <svg
          className={`w-3 h-3 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="absolute top-full left-0 mt-2 w-80 p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl z-50 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-emerald-400"
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
            <h3 className="font-semibold text-white text-sm">
              Verified Confidential Inference
            </h3>
          </div>
          <div className="space-y-2 text-xs text-zinc-400">
            <p>
              Your messages are processed inside a{" "}
              <span className="text-emerald-400 font-medium">
                Trusted Execution Environment (TEE)
              </span>{" "}
              powered by NEAR AI.
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Prompts &amp; responses encrypted end-to-end</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Invisible to cloud provider, NEAR AI, and third parties</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>TLS terminates inside the TEE — no plaintext exposure</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Conversations stored only in your browser</span>
              </div>
            </div>
          </div>
          <a
            href="https://docs.near.ai/cloud/private-inference"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Learn more about NEAR AI privacy
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
