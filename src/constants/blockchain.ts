import type { Address } from "viem";
import { metis } from "wagmi/chains";
import BigNumber from "bignumber.js";

export const TOKEN_FACTORY_ADDRESS = import.meta.env.VITE_TOKEN_FACTORY_ADDRESS;
export const LOCK_TOKEN_FACTORY_ADDRESS = import.meta.env.VITE_LOCK_TOKEN_FACTORY_ADDRESS;
export const DEPOSIT_WITHDRAW_ADDRESS = import.meta.env.VITE_DEPOSIT_WITHDRAW_ADDRESS;

export const UNISWAP_V2_ROUTER_ADDRESS = {
  [metis.id]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
} as Record<number, Address>;

export const WRAPPED_ETH_ADDRESS = {
  [metis.id]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
} as Record<number, Address>;

export const PROJECT_PAGE_SIZE = 12;

export const VIRTUAL_SUPPLY = Number(import.meta.env.VITE_VIRTUAL_SUPPLY) * 1e18;
export const RESERVE_RATIO = Number(import.meta.env.VITE_RESERVE_RATIO);
export const POOL_BALANCE = BigNumber(import.meta.env.VITE_VIRTUAL_POOL_BALANCE).multipliedBy(1e18);
export const LIQUIDITY_THRESHOLD = BigNumber(import.meta.env.VITE_LIQUIDITY_THRESHOLD).multipliedBy(
  1e18
);

export const NATIVE_TOKEN_ADDRESS = import.meta.env.VITE_NATIVE_TOKEN_ADDRESS;
