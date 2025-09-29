import { ethers, JsonRpcApiProvider } from "ethers";
import { Call, multicall } from "./evm-multicall";
import { ERC20Abi, MulticallAbi } from "@/smart-contracts/abi";

async function getBalancesOnEvm(userAddress: string, tokenAddresses: string[]) {
  const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_WORLDCHAIN_RPC_URL);
  const multiCallAddress = import.meta.env.VITE_GET_BALANCE_ETHEREUM_ADDRESS;

  const calls: Call[] = [];
  for (const tokenAddress of tokenAddresses) {
    // Check native token
    if (tokenAddress === "_") {
      calls.push({
        target: multiCallAddress,
        method: "getEthBalance",
        params: [userAddress],
        contract: new ethers.Contract(multiCallAddress, MulticallAbi, provider),
      });
    } else {
      calls.push({
        target: tokenAddress,
        method: "balanceOf",
        params: [userAddress],
        contract: new ethers.Contract(tokenAddress, ERC20Abi, provider),
      });
    }
  }

  const multicallResult = await multicall(provider as JsonRpcApiProvider, multiCallAddress, calls);

  if (!multicallResult) {
    return;
  }

  const result: Record<string, string> = {};

  for (let i = 0; i < tokenAddresses.length; i++) {
    const balance = multicallResult?.[i]?.[0]?.toString();

    result[tokenAddresses[i]] = balance;
  }

  return result;
}

export default getBalancesOnEvm;
