import { useEffect, useRef, useState, useCallback } from "react";
import { createChart, ColorType, type IChartApi, type ISeriesApi, Time } from "lightweight-charts";
import { useMemeControllerFindDetail } from "@/services/queries";
import { getAddress } from "viem";
import { makeApiRequest } from "@/services/trading-chart/helpers";
import { onStreamingMessage, StreamingEventName, subscribeToChannel } from "@/lib/socket";
import PriceTiny from "@/features/token-detail/components/format-price";
import { toCurrency } from "@/lib/number";
import { handleChartInteraction } from "@/lib/chart";

const TIME_PERIODS = [
  { label: "1H", value: 60 * 60 },
  { label: "1D", value: 24 * 60 * 60 },
  { label: "5D", value: 5 * 24 * 60 * 60 },
  { label: "1W", value: 7 * 24 * 60 * 60 },
  { label: "1M", value: 30 * 24 * 60 * 60 },
];

const RESOLUTION_OPTIONS = [
  { value: 60 * 60, resolution: 60 }, // 1H
  { value: 24 * 60 * 60, resolution: 800 }, // 1D
  { value: 5 * 24 * 60 * 60, resolution: 1440 }, // 5D
  { value: 7 * 24 * 60 * 60, resolution: 1440 }, // 1W
  { value: 30 * 24 * 60 * 60, resolution: 1440 }, // 1M
];

const GREEN_CHART_COLOR = "#19BF58";
const RED_CHART_COLOR = "#FF2558";

type LineTradingChartProps = {
  funId: string;
  refetchMeme?: () => void;
  currentPrice?: string;
};

export default function LineTradingChart({ funId, refetchMeme }: LineTradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const isInitializingRef = useRef<boolean>(false);

  const [selectedResolution, setSelectedResolution] = useState<number>(TIME_PERIODS[1].value);
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<{
    top: number;
    left: number;
    value: number;
    time: number;
  } | null>(null);

  // Memoize tooltip update function to prevent unnecessary re-renders
  const updateTooltip = useCallback((newTooltip: typeof tooltip) => {
    setTooltip(newTooltip);
  }, []);

  const {
    data: memeDetail,
    isFetched,
    refetch: fetchMemeDetail,
  } = useMemeControllerFindDetail(getAddress(funId), {
    query: {
      refetchInterval: 3000,
    },
  });

  const [currentPrice, setCurrentPrice] = useState<number>(1);
  const [listNewTransactionHash, setListNewTransactionHash] = useState<string[]>([]);

  useEffect(() => {
    setCurrentPrice(Number(memeDetail?.currentPriceByUsd || currentPrice));
  }, [memeDetail?.currentPriceByUsd]);

  const changePercent = Number(memeDetail?.price24hChange || 0);

  const getCurrentTokenChart = useCallback(
    async (from: number, to: number) => {
      const urlParameters: Record<string, string | number> = {
        symbol: funId,
        resolution:
          RESOLUTION_OPTIONS?.find(item => item.value === selectedResolution)?.resolution || 60,
        from: from,
        to: to,
      };

      const query = Object.keys(urlParameters)
        .map(name => `${name}=${urlParameters[name]}`)
        .join("&");

      const data = await makeApiRequest(`/api/transaction/charts?${query}&byUsd=1`);

      return data.map((item: any) => ({
        time: Number(item.time),
        value: String(item.c),
      }));
    },
    [funId, selectedResolution]
  );

  function getPriceFormat(currentPrice: number): any {
    let precision = 2;

    if (currentPrice < 1 && currentPrice > 0) {
      const decimalPart = currentPrice.toString().split(".")[1] || "";
      precision = decimalPart.length;
    }

    const minMove = parseFloat((1 / Math.pow(10, precision)).toFixed(precision + 3));

    return {
      type: "price",
      precision,
      minMove,
    };
  }

  // Clean up chart function
  const cleanupChart = useCallback(() => {
    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (error) {
        console.warn("Error removing chart:", error);
      }
      chartRef.current = null;
    }
    seriesRef.current = null;
    setIsChartReady(false);
    isInitializingRef.current = false;
    setTooltip(null);
  }, []);

  // Initialize chart - only depends on funId to prevent duplicate creation
  useEffect(() => {
    if (!funId) return;

    // Clean up any existing chart first
    cleanupChart();

    const initializeChart = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializingRef.current || !chartContainerRef.current || !isFetched || !memeDetail) {
        return;
      }

      isInitializingRef.current = true;

      try {
        const initChartData = await getCurrentTokenChart(
          Math.round(Date.now() / 1000) - selectedResolution,
          Math.round(Date.now() / 1000)
        );

        // Double check that we still don't have a chart (race condition protection)
        if (chartRef.current || !chartContainerRef.current) {
          isInitializingRef.current = false;
          return;
        }

        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: "transparent" },
            textColor: "#666",
          },
          width: chartContainerRef.current.clientWidth,
          height: 200,
          grid: {
            vertLines: { visible: false },
            horzLines: { visible: false },
          },
          crosshair: {
            horzLine: {
              visible: false,
            },
            vertLine: {
              visible: false,
            },
          },
          timeScale: {
            visible: true,
            secondsVisible: false,
            borderVisible: false,
          },
          handleScroll: {
            mouseWheel: false,
            pressedMouseMove: false,
            horzTouchDrag: false,
            vertTouchDrag: false,
          },
          handleScale: {
            axisPressedMouseMove: false,
            mouseWheel: false,
            pinch: false,
          },
        });

        const minValue = Math.min(
          ...initChartData.map((item: any) => parseFloat(toCurrency(item.value, { decimals: 18 })))
        );

        // Set price format based on the current price
        const priceFormat = getPriceFormat(minValue);

        const lineSeries = chart.addLineSeries({
          color: changePercent >= 0 ? GREEN_CHART_COLOR : RED_CHART_COLOR,
          lineWidth: 2,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: false,
          priceScaleId: "right",
          priceFormat,
        });

        chart.applyOptions({
          rightPriceScale: {
            visible: false,
            borderVisible: false,
          },
          timeScale: {
            borderVisible: false,
            visible: false,
          },
        });

        const container = document.getElementById("container");
        if (!container) return;

        const toolTipWidth = 120;
        const toolTipHeight = 80;
        const toolTipMargin = 15;

        const toolTip = document.createElement("div");
        toolTip.style.width = toolTipWidth + "px";
        toolTip.style.height = toolTipHeight + "px";
        toolTip.style.position = "absolute";
        toolTip.style.display = "none";
        toolTip.style.padding = "8px";
        toolTip.style.boxSizing = "border-box";
        toolTip.style.fontSize = "12px";
        toolTip.style.textAlign = "left";
        toolTip.style.zIndex = "1000";
        toolTip.style.top = "12px";
        toolTip.style.left = "12px";
        toolTip.style.pointerEvents = "none";
        toolTip.style.border = "1px solid";
        toolTip.style.borderRadius = "4px";
        toolTip.style.fontFamily =
          "-apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif";
        toolTip.style.background = "white";
        toolTip.style.color = "black";
        toolTip.style.borderColor = "black";
        toolTip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        container.appendChild(toolTip);

        // Create circle point indicator
        const circlePoint = document.createElement("div");
        circlePoint.style.width = "12px";
        circlePoint.style.height = "12px";
        circlePoint.style.position = "absolute";
        circlePoint.style.display = "none";
        circlePoint.style.borderRadius = "50%";
        circlePoint.style.backgroundColor = "black";
        circlePoint.style.border = "3px solid white";
        circlePoint.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
        circlePoint.style.zIndex = "999";
        circlePoint.style.pointerEvents = "none";
        container.appendChild(circlePoint);

        // Wrapper function for tooltip and circle point functionality
        const handleChartInteractionWrapper = (param: any) => {
          handleChartInteraction(
            param,
            lineSeries,
            container,
            toolTip,
            circlePoint,
            toolTipWidth,
            toolTipHeight,
            toolTipMargin
          );
        };

        // Subscribe to both click and crosshair move events
        chart.subscribeClick(handleChartInteractionWrapper);
        chart.subscribeCrosshairMove(handleChartInteractionWrapper);

        // Set data
        lineSeries.setData(
          initChartData.map((item: { time: number; value: string }) => ({
            ...item,
            value: parseFloat(toCurrency(item.value, { decimals: 18 })),
          }))
        );

        const times = initChartData.map((item: any) => item.time);
        if (times.length > 0) {
          const minTime = Math.min(...times);
          const maxTime = Math.max(...times);

          chart.timeScale().setVisibleRange({
            from: minTime as Time,
            to: maxTime as Time,
          });
        }

        // Store references only after successful creation
        chartRef.current = chart;
        seriesRef.current = lineSeries;
        setIsChartReady(true);
      } catch (error) {
        console.error("Error initializing chart:", error);
      } finally {
        isInitializingRef.current = false;
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (isFetched && memeDetail) {
        initializeChart();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanupChart();
    };
  }, [funId]); // Only depend on funId for initialization

  // Update chart data when meme detail changes (separate from initialization)
  useEffect(() => {
    if (isChartReady && chartRef.current && seriesRef.current && memeDetail) {
      // Update chart color based on price change
      const newColor = changePercent >= 0 ? GREEN_CHART_COLOR : RED_CHART_COLOR;
      seriesRef.current.applyOptions({
        color: newColor,
      });
    }
  }, [isChartReady, memeDetail, changePercent]);

  // Update chart data when resolution changes
  useEffect(() => {
    const handleFetchNewResolution = async () => {
      if (!isChartReady || !seriesRef.current || isInitializingRef.current) {
        return;
      }

      try {
        const to = Math.round(Date.now() / 1000);
        const from = to - selectedResolution;

        const newDataByResolution = await getCurrentTokenChart(from, to);

        if (seriesRef.current && newDataByResolution?.length > 0) {
          seriesRef.current.setData(
            newDataByResolution.map((item: { time: number; value: string }) => ({
              ...item,
              value: Number(item.value),
            }))
          );

          const lastPoint = newDataByResolution[newDataByResolution.length - 1];
          chartRef.current?.timeScale().setVisibleRange({
            from: newDataByResolution[0].time as Time,
            to: lastPoint.time as Time,
          });
        }
      } catch (error) {
        console.error("Error updating chart data:", error);
      }
    };

    if (selectedResolution && isChartReady) {
      handleFetchNewResolution();
    }
  }, [selectedResolution]);

  // Handle real-time updates
  useEffect(() => {
    if (!funId || !isChartReady) {
      return;
    }

    subscribeToChannel(StreamingEventName.SubscribeNewTradeTransaction, getAddress(funId));

    const handleStreamingMessage = (newTrading: any) => {
      if (seriesRef.current && !listNewTransactionHash.includes(newTrading.hash)) {
        try {
          seriesRef.current.update({
            time: newTrading.timestamp,
            value: parseFloat(toCurrency(newTrading.priceAtTime, { decimals: 10 })),
          });

          setListNewTransactionHash(prev => [...prev, newTrading.hash]);
        } catch (error) {
          console.error("Error updating chart with streaming data:", error);
        }
      }
    };

    onStreamingMessage(StreamingEventName.SubscribeNewTradeTransaction, handleStreamingMessage);

    return () => {
      subscribeToChannel(StreamingEventName.UnSubscribeNewTradeTransaction, getAddress(funId));
    };
  }, [funId, isChartReady, listNewTransactionHash, refetchMeme, fetchMemeDetail]);

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartContainerRef.current && !chartContainerRef.current.contains(event.target as Node)) {
        updateTooltip(null);
        seriesRef.current?.setMarkers([]);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [updateTooltip]);

  const handlePeriodChange = (period: number) => {
    seriesRef.current?.setMarkers([]);
    setTooltip(null);
    setSelectedResolution(period);
  };

  const formatChange = (percent: number) => {
    return `${percent.toFixed(2)}%`;
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-none">
      <div className="mb-6">
        <div className="mb-2 flex flex-col items-center gap-3">
          <PriceTiny price={currentPrice} />

          <div className="flex items-center gap-1">
            {changePercent !== 0 && (
              <span className={`text-sm ${changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                {changePercent > 0 ? "↑" : "↓"}
              </span>
            )}
            <span
              className={`text-sm font-medium ${changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {formatChange(changePercent)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative mb-6">
        <div
          ref={chartContainerRef}
          className="h-[180px] w-full overflow-hidden"
          id="container"
          style={{
            position: "relative",
            contain: "layout style paint",
          }}
        />
      </div>

      {/* Time Period Selector */}
      <div className="flex justify-center gap-2">
        {TIME_PERIODS.map(period => (
          <button
            key={period.value}
            onClick={() => handlePeriodChange(period.value)}
            disabled={!isChartReady}
            className={`w-[50px] rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              selectedResolution === period.value
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
}
