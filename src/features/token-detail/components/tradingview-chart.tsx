import { memo, useEffect, useRef } from "react";
import { FunDataFeed } from "@/services/trading-chart";
import {
  type ChartingLibraryWidgetOptions,
  type LanguageCode,
  type ResolutionString,
  widget,
} from "@/public/static/charting_library/charting_library.esm";

// const GREEN_CHART_COLOR = "#19BF58";
const RED_CHART_COLOR = "#FF2558";

export const TradingViewChart = memo(
  (
    props: Partial<ChartingLibraryWidgetOptions> & {
      funId: string;
      symbol: string;
    }
  ) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: props.symbol,
        theme: "dark",
        datafeed: new FunDataFeed({}, props.funId),
        timezone: props.timezone,
        interval: "1" as ResolutionString,
        container: chartContainerRef.current as HTMLElement,
        library_path: "/static/charting_library/",
        locale: "en" as LanguageCode,
        disabled_features: [
          "popup_hints",
          "study_templates",
          "header_symbol_search",
          "header_compare",
          "header_quick_search",
          "header_indicators",
          "header_screenshot",
          "save_chart_properties_to_local_storage",
          "use_localstorage_for_settings",
        ],
        enabled_features: [
          "study_templates",
          "iframe_loading_compatibility_mode",
          "save_chart_properties_to_local_storage",
          "use_localstorage_for_settings",
        ],
        favorites: { chartTypes: ["Line"] },
        charts_storage_api_version: "1.1",
        fullscreen: false,
        autosize: true,
        loading_screen: {
          backgroundColor: "#222433",
          foregroundColor: "#222433",
        },
        overrides: {
          "paneProperties.background": "#222433",
          "paneProperties.backgroundType": "solid",
          "scalesProperties.backgroundColor": "#222433",

          "mainSeriesProperties.style": 2, // line chart
        },
      };

      const tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(() => {
        tvWidget.headerReady().then(() => {
          const chart = tvWidget.activeChart();
          const priceScale = tvWidget.activeChart().getPanes()[0].getRightPriceScales()[0];
          priceScale.setMode(1);

          // Set color for the main series
          const mainSeries = chart.getSeries();
          mainSeries.setChartStyleProperties(2, {
            color: RED_CHART_COLOR,
            linewidth: 2,
          });
        });
      });

      return () => {
        tvWidget.remove();
      };
    }, [props]);

    return <div ref={chartContainerRef} className="h-full w-full" />;
  }
);
