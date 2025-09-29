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

import { parseFullSymbol, resolutionToMiliseconds } from "./helpers";

type SocketDataProps = {
  tokenAddress: string;
  time: number;
  o: number;
  h: number;
  l: number;
  c: number;
  resolution: ResolutionString;
};

const ONE_MINUTE = 60; // in seconds

onStreamingMessage(StreamingEventName.SubscribeChart, (data: any) => {
  console.log("[socket] New streaming message to:", StreamingEventName.SubscribeChart, data);
  const parsedData: SocketDataProps = typeof data === "string" ? JSON.parse(data) : data;
  const { tokenAddress: funId, time, o, h, l, c, resolution } = parsedData;

  const channelString = `Chart:${funId}:${resolution}`;
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
      open: o,
      high: h,
      low: l,
      close: c,
    };
  } else {
    bar = {
      ...subscriptionItem.lastBar,
      high: Math.max(subscriptionItem.lastBar.high, h),
      low: Math.min(subscriptionItem.lastBar.low, l),
      close: c,
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

  const channel = {
    tokenAddress: funId,
    resolution: String(resolutionToMiliseconds[resolution as keyof typeof resolutionToMiliseconds]),
  };
  const channelString = `Chart:${funId}:${channel.resolution}`;
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
  subscribeToChannel(StreamingEventName.SubscribeChart, channel);
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
        unsubscribeToChannel(StreamingEventName.UnSubscribeChart, channelString);
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
