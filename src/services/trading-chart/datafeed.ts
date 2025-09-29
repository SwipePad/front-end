import {
  type ErrorCallback,
  type HistoryCallback,
  type LibrarySymbolInfo,
  type OnReadyCallback,
  type PeriodParams,
  type ResolutionString,
  type ResolveCallback,
  type SearchSymbolsCallback,
  type SubscribeBarsCallback,
} from "@/public/static/charting_library/charting_library";

import {
  configurationData,
  getAllSymbols,
  makeApiRequest,
  parseFullSymbol,
  resolutionToMiliseconds,
} from "./helpers";
import { subscribeOnStream, unsubscribeFromStream } from "@/services/trading-chart/streaming-v2";

export interface DataFeedOptions {
  SymbolInfo?: TradingView.LibrarySymbolInfo;
  DatafeedConfiguration?: TradingView.DatafeedConfiguration;
  getBars?: TradingView.IDatafeedChartApi["getBars"];
}

const previousBarsCache = new Map<string, TradingView.Bar[]>();

export class FunDataFeed implements TradingView.IExternalDatafeed, TradingView.IDatafeedChartApi {
  private options: DataFeedOptions;
  private lastBarsCache: Map<string, TradingView.Bar>;
  private funId: string;

  constructor(options: DataFeedOptions, funId: string) {
    this.options = options;
    this.lastBarsCache = new Map();
    this.options.DatafeedConfiguration = configurationData;
    this.funId = funId;
  }

  public onReady(callback: OnReadyCallback) {
    setTimeout(() => callback(configurationData));
  }

  public async resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: ResolveCallback,
    _onResolveErrorCallback: ErrorCallback
  ) {
    const ticker = symbolName.split(":")[1];

    // Symbol information object
    const symbolInfo = {
      ticker: symbolName,
      name: ticker,
      description: ticker,
      type: "crypto",
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: "SwipePad", // change here
      minmov: 1,
      pricescale: 1_000_000_000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "60", "D"],
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: false,
      volume_precision: 2,
      data_status: "streaming",
      listed_exchange: "SwipePad", // change here
      format: "price",
    } satisfies LibrarySymbolInfo;
    onSymbolResolvedCallback(symbolInfo);
  }

  public async searchSymbols(
    userInput: string,
    exchange: string,
    _symbolType: string,
    onResultReadyCallback: SearchSymbolsCallback
  ) {
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter(symbol => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  }

  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback
  ): Promise<void> {
    const { from, to, firstDataRequest } = periodParams;
    const parsedSymbol = parseFullSymbol(symbolInfo.ticker as string);
    if (!parsedSymbol) {
      onErrorCallback("Cannot parse symbol");
      return;
    }

    const milisFrom = from;
    const milisTo = to;
    const maxTimeWindow = 30 * 24 * 60 * 60; // 30 days

    const urlParameters: Record<string, string | number> = {
      symbol: this.funId,
      resolution: resolutionToMiliseconds[resolution as keyof typeof resolutionToMiliseconds],
      from: milisFrom - maxTimeWindow,
      to: milisTo,
    };

    const query = Object.keys(urlParameters)
      .map(name => `${name}=${urlParameters[name]}`)
      .join("&");
    try {
      const data = await makeApiRequest(`/api/transaction/charts?${query}&byUsd=1`);
      if (data.length === 0) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], { noData: true });
        return;
      }

      let bars: string | any[] = [];

      data.forEach((bar: any) => {
        if (bar.time >= milisFrom - maxTimeWindow && bar.time < milisTo) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.l,
              high: bar.h,
              open: bar.o,
              close: bar.c,
            },
          ];
        }
      });

      // check if all the items in bars is the same as previous bars
      const previousBars = previousBarsCache.get(symbolInfo.ticker as string);
      if (
        !firstDataRequest &&
        previousBars &&
        bars.every((bar, index) => bar.time === previousBars[index]?.time)
      ) {
        onHistoryCallback([], { noData: true });
        return;
      }

      previousBarsCache.set(symbolInfo.ticker as string, bars);

      if (firstDataRequest) {
        this.lastBarsCache.set(symbolInfo.ticker as string, {
          ...bars[bars.length - 1],
        });
      }

      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.error("[getBars]: Get error", error);
      onHistoryCallback([], { noData: true });
      onErrorCallback(error as string);
    }
  }

  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ): void {
    subscribeOnStream(
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback,
      this.funId,
      this.lastBarsCache.get(symbolInfo.name)
    );
  }

  public unsubscribeBars(listenerGuid: string): void {
    unsubscribeFromStream(listenerGuid);
  }
}
