import {
  config,
  HoldSo,
  inmemoryTokenStorage,
  SwapHelper,
  SwapParams,
  TokenProvider,
  ZeroX,
} from "@holdstation/worldchain-sdk";
import { Client, Multicall3 } from "@holdstation/worldchain-viem";
import { createPublicClient, http, PublicClient } from "viem";
import { worldchain } from "viem/chains";

const RPC_URL = "https://worldchain-mainnet.g.alchemy.com/public";

const publicClient = createPublicClient({
  chain: worldchain,
  transport: http(RPC_URL),
  batch: {
    multicall: true, // Enable multicall batching
  },
  cacheTime: 300000, // Set cache time in milliseconds
});

const client = new Client(publicClient as PublicClient);
config.client = client;
config.multicall3 = new Multicall3(publicClient as PublicClient);

const swapHelper = new SwapHelper(client, {
  tokenStorage: inmemoryTokenStorage,
});

const tokenProvider = new TokenProvider({
  client,
  multicall3: config.multicall3,
});

const zeroX = new ZeroX(tokenProvider, inmemoryTokenStorage);
const worldswap = new HoldSo(tokenProvider, inmemoryTokenStorage);

swapHelper.load(zeroX);
swapHelper.load(worldswap);

// Token functions
// export async function getTokenDetail() {
//   console.log("Fetching multiple token details...");
//   const tokens = await tokenProvider.details(
//     "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
//     "0xEd10C200aFc35AF91A45E8BE53cd5a299F93F32F",
//     "0xdCe053d9ba0Fa2c5f772416b64F191158Cbcc32E",
//   );

//   console.log("Token Details:", tokens);
//   return tokens;
// }

// export async function getTokenInfo() {
//   console.log("Fetching single token info...");
//   const tokenInfo = await tokenProvider.details(
//     "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
//   );

//   console.log("Token Info:", tokenInfo);
//   return tokenInfo;
// }

// Swap functions
export async function estimateSwap(data: SwapParams["quoteInput"]) {
  console.log("Estimating swap...");
  const params: SwapParams["quoteInput"] = {
    tokenIn: data.tokenIn,
    tokenOut: data.tokenOut,
    amountIn: data.amountIn,
    slippage: data.slippage,
    fee: data.fee ?? "0.3",
  };

  const result = await swapHelper.estimate.quote(params);
  return result;
}

export async function swap(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  slippage: string = "0.3",
  fee: string = "0.3" // Default fee percentage
) {
  console.log("Executing swap...");
  const params: SwapParams["quoteInput"] = {
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    amountIn: amountIn,
    slippage: slippage,
    fee: fee,
  };

  const quoteResponse = await swapHelper.estimate.quote(params);

  const swapParams: SwapParams["input"] = {
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    amountIn: amountIn,
    tx: {
      data: quoteResponse.data,
      to: quoteResponse.to,
      value: quoteResponse.value,
    },
    partnerCode: "0", // Replace with your partner code, contact to holdstation team to get one
    feeAmountOut: quoteResponse.addons?.feeAmountOut,
    fee: fee,
  };
  const result = await swapHelper.swap(swapParams);
  console.log("Swap result:", result);
  return result;
}
