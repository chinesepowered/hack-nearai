export interface WalletData {
  address: string;
  chain: "near" | "ethereum";
  balance: string;
  transactionCount?: number;
  storageUsed?: string;
  hasContract?: boolean;
  error?: string;
}

const ETH_ADDRESS = /\b(0x[0-9a-fA-F]{40})\b/g;
const NEAR_ADDRESS = /\b([a-z0-9][a-z0-9_-]*\.near)\b/gi;

export function detectAddresses(
  text: string,
): { address: string; chain: "near" | "ethereum" }[] {
  const results: { address: string; chain: "near" | "ethereum" }[] = [];
  const seen = new Set<string>();

  let match;

  ETH_ADDRESS.lastIndex = 0;
  NEAR_ADDRESS.lastIndex = 0;

  while ((match = ETH_ADDRESS.exec(text)) !== null) {
    const addr = match[1];
    if (!seen.has(addr.toLowerCase())) {
      seen.add(addr.toLowerCase());
      results.push({ address: addr, chain: "ethereum" });
    }
  }

  while ((match = NEAR_ADDRESS.exec(text)) !== null) {
    const addr = match[1].toLowerCase();
    if (!seen.has(addr)) {
      seen.add(addr);
      results.push({ address: addr, chain: "near" });
    }
  }

  return results;
}

export async function fetchMultipleWallets(
  addresses: { address: string; chain: "near" | "ethereum" }[],
): Promise<WalletData[]> {
  return Promise.all(
    addresses.map(async (a) => {
      try {
        const res = await fetch(
          `/api/wallet?address=${encodeURIComponent(a.address)}&chain=${a.chain}`,
        );
        if (!res.ok) throw new Error("Failed");
        return res.json();
      } catch {
        return {
          address: a.address,
          chain: a.chain,
          balance: "unknown",
          error: "Could not fetch wallet data",
        };
      }
    }),
  );
}

export function formatWalletContext(wallets: WalletData[]): string {
  if (wallets.length === 0) return "";

  let context = "\n[WALLET DATA — Fetched privately by UNDOX]\n";

  for (const w of wallets) {
    if (w.error) {
      context += `\n${w.chain.toUpperCase()} | ${w.address}\n`;
      context += `  Status: Could not fetch (${w.error})\n`;
      continue;
    }

    context += `\n${w.chain.toUpperCase()} | ${w.address}\n`;
    context += `  Balance: ${w.balance}\n`;
    if (w.transactionCount !== undefined)
      context += `  Transaction count: ${w.transactionCount}\n`;
    if (w.storageUsed) context += `  Storage used: ${w.storageUsed}\n`;
    if (w.hasContract !== undefined)
      context += `  Has deployed contract: ${w.hasContract ? "Yes" : "No"}\n`;
  }

  context += "\n[END WALLET DATA]\n";
  return context;
}
