import { MulticallAbi } from "@/smart-contracts/abi";
import { BytesLike, FunctionFragment, Interface, JsonRpcApiProvider } from "ethers";
import { Contract, Fragment, JsonFragment } from "ethers";

export type Call = {
  contract?: Contract;
  method?: string;
  target?: string;
  signature?: string;
  abi?: JsonFragment | Fragment;
  params?: unknown[];
};

export const getMultiCallAddress = () => {
  return "0xcA11bde05977b3631167028862bE2a173976CA11";
};

export const multicall = async (
  provider: JsonRpcApiProvider,
  multicallAddress: string,
  calls: Call[],
  options?: { blockTag?: number | string; requireSuccess?: boolean },
  batch: number = 1500
) => {
  if (!calls || calls.length === 0) {
    return [];
  }

  const results: any[] = [];

  for (let i = 0; i < calls.length; i += batch) {
    const batchCalls = calls.slice(i, i + batch);
    const batchResults = await _multicallBatch(provider, multicallAddress, batchCalls, options);
    results.push(...batchResults);
  }

  return results;
};

const _multicallBatch = async (
  provider: JsonRpcApiProvider,
  multicallAddress: string,
  calls: Call[],
  options?: { blockTag?: number | string; requireSuccess?: boolean }
) => {
  if (!calls || !calls.length) {
    return [];
  }

  const blockTag = options?.blockTag == null ? "latest" : "0x" + options.blockTag.toString(16);
  try {
    const callData = calls.map(call => {
      return [call.target || call.contract?.target, _encodeCallData(call)] as [string, string];
    });

    const aggregateData = _multicallInterface.encodeFunctionData("tryAggregate", [
      options?.requireSuccess || false,
      callData,
    ]);

    const response = await provider.send("eth_call", [
      {
        to: multicallAddress,
        data: aggregateData,
      },
      blockTag,
    ]);

    const returnData = _multicallInterface.decodeFunctionResult(
      "tryAggregate",
      response
    ).returnData;

    return calls.map((call, index) => {
      const [success, returnDatum] = returnData[index];
      if (returnDatum == "0x" && !options?.requireSuccess) return null;
      if (!success) {
        throw new Error("Multicall unsuccessful");
      } else {
        return _decodeReturnData(call, returnDatum);
      }
    });
  } catch (e) {
    console.error("Multicall error " + (e as Error).message);
    throw new Error("Multicall failed");
  }
};

const _multicallInterface = new Interface(MulticallAbi);

const _encodeCallData = (call: Call) => {
  const iface = call.contract
    ? call.contract.interface
    : call.abi
      ? new Interface([call.abi])
      : new Interface([`function ${call.signature}`]);
  const method = call.method ?? (iface.fragments[0] as FunctionFragment).name;
  if (!method) {
    throw new Error("Invalid fragment");
  }
  const callData = iface.encodeFunctionData(method, call.params || []);
  return callData;
};

const _decodeReturnData = (call: Call, data: BytesLike) => {
  if (data == "0x") {
    throw new Error("Failed to decode: Empty data");
  }
  const iface = call.contract
    ? call.contract.interface
    : call.abi
      ? new Interface([call.abi])
      : new Interface([`function ${call.signature}`]);
  const method = call.method ?? (iface.fragments[0] as FunctionFragment).name;
  if (!method) {
    throw new Error("Invalid fragment");
  }
  try {
    const result = iface.decodeFunctionResult(method, data);
    return result as CallResult;
  } catch (e) {
    console.error(
      "Can not decode result of call " +
        JSON.stringify({
          address: call.target || call.contract?.address,
          method: call.signature || call.method,
        }) +
        "due to error " +
        (e as Error).message
    );

    throw e;
  }
};

export interface CallResult extends Array<unknown> {
  [x: string]: unknown;
}
