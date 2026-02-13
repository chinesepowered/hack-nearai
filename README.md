# UNDOX

**Private AI for the things you'd never ask ChatGPT.**

UNDOX is an AI assistant where your prompts are encrypted and processed inside a Trusted Execution Environment (TEE). No accounts. No tracking. No data retention. Your questions about crypto wallets, health concerns, financial situations, and personal matters stay yours — mathematically guaranteed.

## The Problem

Every question you ask ChatGPT, Claude, or Gemini is linked to your identity. Stored on servers. Profiled. Monetizable. Subpoenable.

People self-censor their most important questions because they know someone is watching. Your wallet addresses get tied to your email. Your medical questions become part of a permanent profile. Your financial concerns are stored indefinitely.

## How UNDOX Works

```
You  -->  [TLS]  -->  [TEE Enclave]  -->  AI Model
                        ^
                        |
                  Nobody can see inside.
                  Not the cloud provider.
                  Not the model provider.
                  Not us.
```

UNDOX routes all inference through [NEAR AI's Private Inference](https://docs.near.ai/cloud/private-inference) infrastructure. Your prompts and responses are processed inside a hardware-secured Trusted Execution Environment with cryptographic attestation. TLS terminates inside the enclave — no plaintext ever leaves.

Conversations are stored locally in your browser via `localStorage`. There is no server-side database, no user accounts, no analytics, no telemetry. Close the tab and it's gone.

## Features

### Private AI Chat
Five specialized categories with tuned system prompts:
- **Crypto & Wallets** — Analyze wallets, review contracts, assess on-chain risk
- **Health & Medical** — Ask what you'd never ask in person
- **Financial & Legal** — Debt, taxes, contracts, legal options
- **Personal & Private** — Relationships, identity, life decisions
- **General** — Everything else, with the same privacy guarantees

### Live Wallet Scanner
Paste any Ethereum (`0x...`) or NEAR (`.near`) address into a crypto conversation. UNDOX auto-detects it, fetches real on-chain data (balance, transaction count, contract status) from public RPCs, and feeds it privately to the AI for analysis. Your wallet address is never linked to your identity.

### File Analysis
Attach text files (`.txt`, `.csv`, `.json`, `.md`, and more) directly in the chat. Files are parsed client-side — their contents never touch our servers separately. The AI analyzes your documents inside the TEE with the same privacy guarantees as regular messages.

### Self-Destruct Timers
Set any conversation to auto-delete after 1 hour, 24 hours, or 7 days. A countdown timer shows in the sidebar. When time's up, the conversation is permanently purged from your browser. No server-side copies exist to begin with.

### Full Data Ownership
- **Inspect** — See exactly what's stored in your browser
- **Export** — Download conversations as JSON or plain text
- **Delete** — Erase individual conversations or everything at once
- **Revoke** — Close the tab. There's nothing else to clean up.

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/page.tsx         # Main chat interface
│   ├── api/
│   │   ├── chat/route.ts     # NEAR AI streaming proxy
│   │   └── wallet/route.ts   # Blockchain RPC proxy (ETH + NEAR)
├── components/
│   ├── ChatInput.tsx          # Message input with file upload
│   ├── MessageList.tsx        # Message rendering with markdown
│   ├── WelcomeScreen.tsx      # Category selection + starters
│   ├── Sidebar.tsx            # Conversation list + data management
│   └── PrivacyBadge.tsx       # Privacy verification panel
├── lib/
│   ├── categories.ts          # Category definitions + system prompts
│   ├── storage.ts             # localStorage CRUD + export + auto-purge
│   └── wallet.ts              # Address detection + wallet data formatting
└── types/
    └── index.ts               # TypeScript interfaces
```

**Key architectural decisions:**
- **No database.** All conversation data lives in `localStorage`. The server is stateless.
- **No auth.** No accounts, no sessions, no cookies. Complete anonymity.
- **Streaming.** Server-Sent Events for real-time AI responses with abort support.
- **Client-side file parsing.** Files are read with `FileReader` — never uploaded separately.
- **Server-side wallet fetch.** Blockchain RPCs are called server-side to avoid CORS issues, with 5-second timeouts. In production, this would run inside the TEE.

## Tech Stack

- **Next.js 14** (App Router) — React framework
- **Tailwind CSS** — Styling
- **NEAR AI API** — Private inference via TEE
- **Public Blockchain RPCs** — NEAR RPC (mainnet), Ethereum (llamarpc)
- **react-markdown + remark-gfm** — Markdown rendering
- **TypeScript** — End-to-end type safety

Zero additional runtime dependencies beyond the above. No state management library. No CSS-in-JS. No ORM. No analytics SDK.

## Getting Started

```bash
# Install dependencies
npm install

# Set your NEAR AI API key
echo "NEAR_AI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting privately.

## Privacy Comparison

|                      | Standard AI         | UNDOX                       |
|----------------------|--------------------|-----------------------------|
| **Your prompts**     | Stored on servers  | TEE only — never stored     |
| **Account required** | Email + phone      | None — fully anonymous      |
| **IP address**       | Logged & tracked   | Not recorded                |
| **Data retention**   | Months to years    | Browser only — you decide   |
| **Can be subpoenaed**| Yes — data exists  | No — no data to give        |
| **Wallet analysis**  | Linked to your email| Anonymous on-chain fetch   |

## License

MIT
