/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  StreamingEventName,
  channelToSubscription,
  onStreamingMessage,
  subscribeToChannel,
  unsubscribeToChannel,
} from "@/lib/socket";
import {
  type Bar,
  type LibrarySymbolInfo,
  type ResolutionString,
  type SubscribeBarsCallback,
} from "@/public/static/charting_library/charting_library";

import { TradeTransactionResponse } from "@/services/models";
import { parseFullSymbol } from "./helpers";

type SocketDataProps = TradeTransactionResponse;

const ONE_MINUTE = 60; // in seconds

//TODO: Add resolution to the channel
const RESOLUTION = "60";

onStreamingMessage(StreamingEventName.SubscribeNewTradeTransaction, (data: any) => {
  console.log(
    "[socket] New streaming message to:",
    StreamingEventName.SubscribeNewTradeTransaction,
    data
  );
  const parsedData: SocketDataProps = typeof data === "string" ? JSON.parse(data) : data;
  const { tokenAddress: funId, timestamp: time, priceAtTime } = parsedData;

  const channelString = `Chart:${funId}:${RESOLUTION}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  console.log("channelString", channelString);
  if (subscriptionItem === undefined) {
    return;
  }

  const lastBar = subscriptionItem.lastBar;
  const nextBarTime = getNextBarTime(lastBar?.time ?? 0);

  let bar;
  if (time >= nextBarTime) {
    bar = {
      time: time * 1000,
      open: priceAtTime,
      high: priceAtTime,
      low: priceAtTime,
      close: priceAtTime,
    };
  } else {
    bar = {
      ...subscriptionItem.lastBar,
      high: Math.max(subscriptionItem.lastBar.high, Number(priceAtTime)),
      low: Math.min(subscriptionItem.lastBar.low, Number(priceAtTime)),
      close: priceAtTime,
    };
  }
  subscriptionItem.lastBar = bar;

  // Send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler: Record<string, any>) => handler.callback(bar));
});

export function getNextBarTime(barTime: number) {
  return barTime + ONE_MINUTE;
}

export function subscribeOnStream(
  symbolInfo: LibrarySymbolInfo,
  resolution: ResolutionString,
  onRealtimeCallback: SubscribeBarsCallback,
  subscriberUID: string,
  _onResetCacheNeededCallback: () => void,
  funId: string,
  lastBar?: Bar
) {
  const parsedSymbol = parseFullSymbol(symbolInfo.ticker as string);
  if (!parsedSymbol) {
    return;
  }

  const channelString = `Chart:${funId}:${RESOLUTION}`;
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // Already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastBar,
    handlers: [handler],
  };
  console.log("subscribe to channel", channelString);
  channelToSubscription.set(channelString, subscriptionItem);
  subscribeToChannel(StreamingEventName.SubscribeNewTradeTransaction, funId);
}

export function unsubscribeFromStream(subscriberUID: string) {
  // Find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler: Record<string, any>) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1) {
      // Remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // Unsubscribe from the channel if it is the last handler
        unsubscribeToChannel(StreamingEventName.UnSubscribeNewTradeTransaction, channelString);
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
