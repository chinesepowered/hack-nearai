import Link from "next/link";

const problems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: "Your wallet addresses",
    desc: "Linked to your email forever. One breach away from public.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Your medical questions",
    desc: "STD concerns, mental health, symptoms — all stored and profiled.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Your financial details",
    desc: "Debt, taxes, legal problems — tied to your identity forever.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Your personal struggles",
    desc: "Relationships, identity, fears — monetized by AI companies.",
  },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Verified Confidentiality",
    desc: "Your prompts and AI responses are processed inside a Trusted Execution Environment (TEE) with cryptographic attestation. Mathematically impossible to access.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Your Data, Your Device",
    desc: "Conversations are stored locally in your browser. Not on our servers. Not on NEAR's servers. Not anywhere. Export, delete, or close the tab anytime.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ),
    title: "Zero Knowledge",
    desc: "We can't see your prompts. The cloud provider can't. NEAR AI can't. The model provider can't. TLS terminates inside the TEE — no plaintext ever leaves the enclave.",
  },
];

const useCases = [
  {
    icon: "🔐",
    title: "Crypto & Wallets",
    color: "text-amber-400",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
    items: [
      "Analyze my wallet without linking it to my identity",
      "Is this smart contract safe to approve?",
      "What are my tax implications?",
      "How traceable is my on-chain activity?",
    ],
  },
  {
    icon: "🏥",
    title: "Health & Medical",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    items: [
      "I think I have an STD — what should I do?",
      "Help me understand these lab results",
      "Side effects I'm embarrassed to ask my doctor about",
      "Mental health questions without a paper trail",
    ],
  },
  {
    icon: "💼",
    title: "Financial & Legal",
    color: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    items: [
      "I'm in debt and need a confidential plan",
      "Review this contract for red flags",
      "Tax situation I need private advice on",
      "What are my legal options?",
    ],
  },
  {
    icon: "🫂",
    title: "Personal & Private",
    color: "text-violet-400",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/5",
    items: [
      "Something I can't tell anyone else",
      "Relationship situation I need advice on",
      "Questioning my identity",
      "Life decision I'm struggling with",
    ],
  },
];

const steps = [
  {
    num: "01",
    title: "Pick a topic",
    desc: "Choose a category or just start typing. Every topic is equally private.",
  },
  {
    num: "02",
    title: "Ask anything",
    desc: "Your prompt is encrypted and processed inside a hardware-secured TEE. Nobody sees it.",
  },
  {
    num: "03",
    title: "Own your data",
    desc: "Conversations live in your browser. Export them, delete them, or close the tab. Your data, your rules.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">UNDOX</span>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm font-medium transition-all"
          >
            Start chatting
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center px-6 pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 pulse-ring" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Powered by NEAR AI Private Inference
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Ask AI anything.
            <br />
            <span className="gradient-text">Without doxxing yourself.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Private AI for crypto wallets, health questions, financial
            situations, and everything else you&apos;d never type into ChatGPT. Your
            prompts never leave the Trusted Execution Environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/25 hover:scale-[1.02]"
            >
              Start chatting privately
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="https://docs.near.ai/cloud/private-inference"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              How privacy works
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The problem with AI today
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Every question you ask ChatGPT, Claude, or Gemini is linked to
              your identity. Stored. Profiled. Monetized.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-4 p-5 rounded-2xl bg-red-500/[0.03] border border-red-500/10"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{p.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we're different */}
      <section className="relative py-24 px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How UNDOX keeps you safe
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Not &ldquo;we promise we don&apos;t look.&rdquo; Mathematically verified
              confidentiality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="relative py-24 px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What people use UNDOX for
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Real questions people actually have but would never type into a
              standard AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className={`p-6 rounded-2xl ${uc.bgColor} border ${uc.borderColor}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{uc.icon}</span>
                  <h3 className={`text-lg font-semibold ${uc.color}`}>
                    {uc.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {uc.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <span className="text-zinc-600 mt-0.5">&ldquo;</span>
                      <span>{item}&rdquo;</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-24 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-4">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy comparison */}
      <section className="relative py-24 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Standard AI vs UNDOX
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              The difference between &ldquo;we promise&rdquo; and &ldquo;we
              can&apos;t.&rdquo;
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr,1fr,1fr] text-center text-sm font-semibold">
              <div className="p-4 bg-zinc-900/50" />
              <div className="p-4 bg-red-500/[0.03] border-l border-zinc-800 text-red-400">
                Standard AI
              </div>
              <div className="p-4 bg-emerald-500/[0.03] border-l border-zinc-800 text-emerald-400">
                UNDOX
              </div>
            </div>
            {/* Rows */}
            {[
              {
                feature: "Your prompts",
                standard: "Stored on servers",
                undox: "TEE only — never stored",
              },
              {
                feature: "Account required",
                standard: "Email + phone",
                undox: "None — fully anonymous",
              },
              {
                feature: "IP address",
                standard: "Logged & tracked",
                undox: "Not recorded",
              },
              {
                feature: "Data retention",
                standard: "Months to years",
                undox: "Browser only — you decide",
              },
              {
                feature: "Can be subpoenaed",
                standard: "Yes — data exists",
                undox: "No — no data to give",
              },
              {
                feature: "Wallet analysis",
                standard: "Linked to your email",
                undox: "Anonymous on-chain fetch",
              },
            ].map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1fr,1fr,1fr] text-sm border-t border-zinc-800/50"
              >
                <div className="px-4 py-3 text-zinc-300 font-medium">
                  {row.feature}
                </div>
                <div className="px-4 py-3 text-red-400/70 border-l border-zinc-800/50 text-center">
                  {row.standard}
                </div>
                <div className="px-4 py-3 text-emerald-400/90 border-l border-zinc-800/50 text-center font-medium">
                  {row.undox}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data ownership section */}
      <section className="relative py-24 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Your data. Your rules.
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-12">
            UNDOX gives you complete control. Not as a feature — as the
            architecture.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { action: "Inspect", desc: "See exactly what's stored", icon: "🔍" },
              { action: "Export", desc: "Download all your data", icon: "📦" },
              { action: "Delete", desc: "Erase everything instantly", icon: "🗑️" },
              { action: "Revoke", desc: "Close the tab — it's gone", icon: "🚫" },
            ].map((item) => (
              <div
                key={item.action}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="font-semibold text-white mb-1">
                  {item.action}
                </h3>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 border-t border-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Privacy is the default.
            <br />
            <span className="gradient-text">Not an option.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            Stop self-censoring your AI conversations.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/25 hover:scale-[1.02]"
          >
            Start chatting privately
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <span>UNDOX</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Powered by{" "}
              <a
                href="https://near.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                NEAR AI
              </a>
            </span>
            <span>·</span>
            <span>
              Built for the{" "}
              <a
                href="https://nearlegion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                NEAR Legion
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
