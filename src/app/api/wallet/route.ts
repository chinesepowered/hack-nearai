import { WalletData } from "@/lib/wallet";

const RPC_TIMEOUT = 5000;

function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timeout),
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain");

  if (!address || !chain) {
    return Response.json(
      { error: "Missing address or chain" },
      { status: 400 },
    );
  }

  try {
    if (chain === "near") {
      return await fetchNearWallet(address);
    }

    if (chain === "ethereum") {
      return await fetchEthWallet(address);
    }

    return Response.json({ error: "Unsupported chain" }, { status: 400 });
  } catch {
    return Response.json({
      address,
      chain: chain as "near" | "ethereum",
      balance: "unknown",
      error: "Failed to connect to blockchain RPC",
    } satisfies WalletData);
  }
}

async function fetchNearWallet(address: string) {
  const res = await fetchWithTimeout("https://rpc.mainnet.near.org", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "undox",
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: address,
      },
    }),
  });

  const data = await res.json();

  if (data.error) {
    return Response.json({
      address,
      chain: "near",
      balance: "unknown",
      error: data.error.cause?.name || "Account not found",
    } satisfies WalletData);
  }

  const result = data.result;
  const balanceYocto = BigInt(result.amount);
  const balanceNear = Number(balanceYocto / BigInt(1e12)) / 1e12;

  return Response.json({
    address,
    chain: "near",
    balance: `${balanceNear.toFixed(4)} NEAR`,
    storageUsed: `${result.storage_usage} bytes`,
    hasContract: result.code_hash !== "11111111111111111111111111111111",
  } satisfies WalletData);
}

async function fetchEthWallet(address: string) {
  const [balanceRes, txCountRes] = await Promise.all([
    fetchWithTimeout("https://eth.llamarpc.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1,
      }),
    }),
    fetchWithTimeout("https://eth.llamarpc.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getTransactionCount",
        params: [address, "latest"],
        id: 2,
      }),
    }),
  ]);

  const balanceData = await balanceRes.json();
  const txCountData = await txCountRes.json();

  if (balanceData.error || !balanceData.result) {
    return Response.json({
      address,
      chain: "ethereum",
      balance: "unknown",
      error: balanceData.error?.message || "RPC error",
    } satisfies WalletData);
  }

  const balanceWei = BigInt(balanceData.result);
  const balanceEth = Number(balanceWei / BigInt(1e10)) / 1e8;
  const txCount = parseInt(txCountData.result || "0x0", 16);

  return Response.json({
    address,
    chain: "ethereum",
    balance: `${balanceEth.toFixed(6)} ETH`,
    transactionCount: txCount,
  } satisfies WalletData);
}
