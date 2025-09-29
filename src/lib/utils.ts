import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Decimal } from "decimal.js";
import {
  LIQUIDITY_THRESHOLD,
  POOL_BALANCE,
  RESERVE_RATIO,
  VIRTUAL_SUPPLY,
} from "@/constants/blockchain";
import urlJoin from "url-join";

export interface EstimateTokenParams {
  tokenIn: string | number;
  slippage: number;
  realTotalSupply?: string | number;
  poolBalance?: string | number;
  poolPumped?: boolean;
  totalRaised: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const padZero = (value: number, length: number) => {
  return value.toString().padStart(length, "0");
};

export const intervalToDuration = ({ start, end }: { start: number; end: number }) => {
  if (!start || !end || start > end) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const duration = end - start;

  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const getTimeDifference = (timestamp: number) => {
  const currentTimestamp = new Date().getTime();
  const end = timestamp < currentTimestamp ? currentTimestamp : timestamp;
  const durations = intervalToDuration({ start: currentTimestamp, end });

  return {
    days: durations.days || 0,
    hours: durations.hours || 0,
    minutes: durations.minutes || 0,
    seconds: durations.seconds || 0,
  };
};

export const getRelativeTime = (timestamp: number): string => {
  const currentTimestamp = new Date().getTime();
  const diffInSeconds = Math.floor((currentTimestamp - timestamp) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  // Less than an hour
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // Less than a week
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // More than a week
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  if (remainingDays === 0) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }

  return `${weeks} ${weeks === 1 ? "week" : "weeks"} ${remainingDays} ${remainingDays === 1 ? "day" : "days"} ago`;
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const shortenAddress = (address: string, start: number = 6, end: number = 4) => {
  if (!address || address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const getExplorerUrl = (address: string) => {
  return `https://explorer.metis.io/address/${address}`;
};

export const headAddress = (address: string) => {
  return address.slice(0, 6);
};

export const formatImageUrl = (url?: string) => {
  if (!url) {
    return "";
  }

  if (!url.startsWith("https://")) {
    const cleanedUrl = url.replace("api/file-upload/offchain", "");
    const baseUrl = "/api/file-upload/offchain";

    return urlJoin(import.meta.env.VITE_API_URL, baseUrl, cleanedUrl);
  }

  return url;
};

export const isObjectEmpty = (obj: Record<string, any>) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const loopAsync = async (
  times: number,
  callback: (index: number) => Promise<void>,
  delays: number
) => {
  for (let i = 0; i < times; i++) {
    await callback(i);
    await sleep(delays);
  }
};

export const estimateTokenBuy = (
  params: EstimateTokenParams
  // metisIn: string | number,
  // slippage: number,
  // realTotalSupply: string | number = 0,
  // poolBalance: string | number = POOL_BALANCE
) => {
  let {
    tokenIn: metisIn,
    slippage,
    realTotalSupply,
    poolBalance,
    poolPumped: isPumped,
    totalRaised,
  } = params;
  if (realTotalSupply === undefined) {
    realTotalSupply = 0;
  }
  if (poolBalance === undefined) {
    poolBalance = POOL_BALANCE.toFixed(0);
  }
  const totalSupply = new Decimal(realTotalSupply || 0).plus(VIRTUAL_SUPPLY);

  const amountIn = new Decimal(LIQUIDITY_THRESHOLD.toFixed(0) || 0)
    .minus(new Decimal(totalRaised || 0))
    .minus(new Decimal(metisIn || 0))
    .gt(0)
    ? new Decimal(metisIn || 0)
    : new Decimal(LIQUIDITY_THRESHOLD.toFixed(0) || 0).minus(new Decimal(totalRaised || 0));

  // expectedOut =
  //
  //   totalSupply *
  //   ((1 + metisIn * (94 / 100)  / poolBalance) ** RESERVE_RATIO - 1);
  // is isPump
  // expectedOut = totalSupply * ((1 + metisIn * (99 / 100)  / poolBalance) ** RESERVE_RATIO - 1);
  const percentActuallyOut = isPumped ? 99 : 94;
  const expectedOut = new Decimal(totalSupply || 0).mul(
    new Decimal(amountIn || 0)
      .mul(percentActuallyOut / 100)
      .dividedBy(poolBalance || 1)
      .plus(1)
      .pow(RESERVE_RATIO)
      .minus(1)
  );
  const minAmountOut = expectedOut.mul(100 - slippage).dividedBy(100);

  return {
    expectedOut: expectedOut.trunc().toNumber(),
    minAmountOut: minAmountOut.trunc().toNumber(),
  };
};

export const estimateTokenSell = (params: EstimateTokenParams) => {
  let { tokenIn, slippage, realTotalSupply, poolBalance, poolPumped } = params;
  if (realTotalSupply === undefined) {
    realTotalSupply = 0;
  }

  if (poolBalance === undefined) {
    poolBalance = POOL_BALANCE.toFixed(0);
  }
  const totalSupply = new Decimal(realTotalSupply || 0).plus(VIRTUAL_SUPPLY);

  //  expectedOut = 94% * poolBalance * (1 - (1 - tokenIn / totalSupply) ** (1 / reserveRatio))
  const percentActuallyOut = poolPumped ? 99 : 94;
  const expectedOut = new Decimal(poolBalance || 0)

    .mul(
      new Decimal(1).minus(
        new Decimal(1)
          .minus(new Decimal(tokenIn || 0).dividedBy(totalSupply || 1))
          .pow(new Decimal(1).dividedBy(RESERVE_RATIO))
      )
    )
    .mul(percentActuallyOut / 100);

  // minAmountOut = (100% - slippage) * expectedOut
  const minAmountOut = expectedOut.mul(100 - slippage).dividedBy(100);

  return {
    expectedOut: expectedOut.trunc().toNumber(),
    minAmountOut: minAmountOut.trunc().toNumber(),
  };
};

export const calculateMyHoldingsToPump = (
  balance: string | number = 0,
  realTotalSupply: string | number = 0
) => {
  // (My holdings to PUMP) = (your token balance - pumped[your address]) / (1e9 - realSupply)
  const myHoldingsToPump = new Decimal(balance || 0).dividedBy(
    new Decimal(1e27).minus(realTotalSupply || 0)
  );

  return myHoldingsToPump.mul(100).toNumber();
};

export const calculatePercentageReadyToPump = (
  totalPumped: string | number = 0,
  realTotalSupply: string | number = 0
) => {
  // (% ready to PUMP) = totalPumped / (1e9 - realSupply)
  const percentageReadyToPump = new Decimal(totalPumped || 0).dividedBy(
    new Decimal(1e27).minus(realTotalSupply || 0)
  );

  return percentageReadyToPump.mul(100).toNumber();
};

export const generateTokenId = () => {
  const tokenId =
    Date.now().toString() + BigInt("0x" + crypto.randomUUID().replace(/-/g, "")).toString();

  return tokenId;
};

export const capitalizeFirst = (str: string): string => {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1);
};

export const getRandomUserImage = () => {
  // Random number from 1 to 4
  const randomNumber = Math.floor(Math.random() * 4) + 1;

  return `/images/profile/user_${randomNumber}.jpg`;
};

export const handleDirectHoldstationWallet = (isBuyWld: boolean = true) => {
  let url = "https://world.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a";

  if (isBuyWld) {
    url += "&path=%2Ftoken%2Fbuy%3Faddress%3D0x2cFc85d8E48F8EAB294be644d9E25C3030863003";
  }

  window.open(url, "_blank");
};
