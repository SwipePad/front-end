import { customClient } from "@/services/custom-client";
import { type SearchSymbolResultItem } from "@/public/static/charting_library/charting_library";

export const configurationData: TradingView.DatafeedConfiguration = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ["1", "5", "60", "D"] as TradingView.ResolutionString[],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [{ value: "pumpe.meme", name: "pumpe.meme", desc: "pumpe.meme" }],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: "crypto", value: "crypto" }],
};

export async function makeApiRequest(path: string) {
  try {
    const response = await customClient({ url: path, method: "GET" });

    return response as any;
  } catch (error) {
    console.error(`request error: ${error}`);
  }
}

export async function makeApiPostRequest(path: string, body: any) {
  try {
    const response = await customClient({ url: path, method: "POST", data: body });
    return response as any;
  } catch (error) {
    console.error(`request error: ${error}`);
  }
}

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange: string, fromSymbol: string, toSymbol: string) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

export async function getAllSymbols() {
  const data = await makeApiRequest("/api/trading-view/search?query=");

  let allSymbols: SearchSymbolResultItem[] = [];

  const jettonsData = data.data;

  for (const jettonData of jettonsData) {
    const symbol = generateSymbol("TONfun", jettonData.symbol, "TON");

    allSymbols = [
      ...allSymbols,
      {
        symbol: symbol.short,
        full_name: symbol.full,
        description: symbol.short,
        exchange: "TONfun",
        type: "crypto",
      } satisfies SearchSymbolResultItem,
    ];
  }

  return allSymbols;
}

export function priceScale(tickSize: string | number) {
  if (Number(tickSize) >= 1) {
    return 10 ** Number(tickSize);
  }
  return Math.round(1 / parseFloat(String(tickSize)));
}

export function parseFullSymbol(fullSymbol: string) {
  const match = fullSymbol.match(/^(\w+):([\w\s]+)\/(\w+)$/);
  if (!match) {
    return null;
  }
  return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}

// Actual time in seconds, but, the API does this way, fck it
export const resolutionToMiliseconds = {
  // "1": 60000,
  // "5": 300000,
  // "60": 3600000,
  // "1D": 86400000,
  "1": 60,
  "5": 300,
  "60": 3600,
  "1D": 86400,
};
