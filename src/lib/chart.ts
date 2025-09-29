import { toCurrency } from "@/lib/number";

// Custom price formatter that mimics PriceTiny component behavior
function formatPriceForTooltip(price: number): string {
  if (!isFinite(price) || isNaN(price)) {
    return "-";
  }

  // For prices >= 0.001, use toCurrency with 4 decimals (like PriceTiny)
  if (Math.abs(price) >= 0.001) {
    return toCurrency(price, { decimals: 4 });
  }

  // For very small prices, format like PriceTiny does
  const fixed = price.toFixed(12);
  const [intPart, fracPartRaw] = fixed.split(".");
  const fracPart = fracPartRaw ?? "";

  // Remove trailing zeros
  const fracTrimmed = fracPart.replace(/0+$/, "");

  // Count leading zeros after decimal
  const match = fracTrimmed.match(/^0+/);
  const zeroCount = match ? match[0].length : 0;
  const significantDigits = fracTrimmed.slice(zeroCount);

  // Format like "0.0₆412" with subscript for zero count
  if (zeroCount > 0) {
    return `${intPart}.0<sub>${zeroCount}</sub>${significantDigits}`;
  } else {
    return `${intPart}.${significantDigits}`;
  }
}

export function calcTooltipPosition(
  point: { x: number; y: number },
  container: HTMLElement,
  tooltipWidth: number,
  tooltipHeight: number,
  margin: number
) {
  let left = point.x + margin;
  if (left > container.clientWidth - tooltipWidth) {
    left = point.x - margin - tooltipWidth;
  }

  let top = point.y + margin;
  if (top > container.clientHeight - tooltipHeight) {
    top = point.y - tooltipHeight - margin;
  }

  return { left, top };
}

export function handleChartEvent(
  param: any,
  lineSeries: any,
  setTooltip: (data: any) => void,
  lastTimeRef: { current: number | null }
) {
  if (!param.point || !param.time || param.point.x < 0 || param.point.y < 0) {
    setTooltip(null);
    return;
  }

  const data = param.seriesData.get(lineSeries);
  if (!data) {
    setTooltip(null);
    return;
  }

  // ✅ update marker only if new point
  if (lastTimeRef.current !== param.time) {
    lastTimeRef.current = param.time as number;
  }

  const container = document.getElementById("container");
  if (!container) return;

  const { left, top } = calcTooltipPosition(param.point, container, 80, 40, 20);

  setTooltip({
    left,
    top,
    value: parseFloat(toCurrency((data as any).value, { decimals: 18 })),
    time: param.time as number,
  });
}

export function handleChartInteraction(
  param: any,
  lineSeries: any,
  container: HTMLElement,
  toolTip: HTMLElement,
  circlePoint: HTMLElement,
  toolTipWidth: number,
  toolTipHeight: number,
  toolTipMargin: number
) {
  if (
    param.point === undefined ||
    !param.time ||
    param.point.x < 0 ||
    param.point.x > container.clientWidth ||
    param.point.y < 0 ||
    param.point.y > container.clientHeight
  ) {
    toolTip.style.display = "none";
    circlePoint.style.display = "none";
    return;
  }

  // Get data from the series
  const data = param.seriesData.get(lineSeries);
  if (!data) {
    toolTip.style.display = "none";
    circlePoint.style.display = "none";
    return;
  }

  // Extract price value
  let price: number | undefined;
  if (data && typeof data === "object") {
    if ("value" in data && typeof data.value === "number") {
      price = data.value;
    } else if ("close" in data && typeof data.close === "number") {
      price = data.close;
    }
  }

  if (price === undefined) {
    toolTip.style.display = "none";
    circlePoint.style.display = "none";
    return;
  }

  // Format time for display
  const timestamp =
    typeof param.time === "number"
      ? param.time
      : typeof param.time === "string"
        ? parseInt(param.time)
        : (param.time as any).timestamp || Date.now() / 1000;
  const date = new Date(timestamp * 1000);
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  // Update tooltip content
  toolTip.innerHTML = `
    <div style="font-size: 18px; margin: 4px 0px; color: black; font-weight: 500;">
      $${formatPriceForTooltip(price)}
    </div>
    <div style="color: #666; font-size: 11px;">
      ${timeStr} ${dateStr}
    </div>
  `;

  // Position tooltip
  let tooltipX = param.point.x + toolTipMargin;
  let tooltipY = param.point.y - toolTipHeight - toolTipMargin;

  // Adjust horizontal position if tooltip goes off screen
  if (tooltipX + toolTipWidth > container.clientWidth) {
    tooltipX = param.point.x - toolTipWidth - toolTipMargin;
  }

  // Adjust vertical position if tooltip goes off screen
  if (tooltipY < 0) {
    tooltipY = param.point.y + toolTipMargin;
  }

  toolTip.style.left = tooltipX + "px";
  toolTip.style.top = tooltipY + "px";
  toolTip.style.display = "block";

  // Position circle point indicator - place it on the chart line at the data point
  // Get the price coordinate from the chart to position the circle on the line
  let priceCoordinate: number | null = null;
  if (typeof price === "number") {
    priceCoordinate = lineSeries.priceToCoordinate(price);
  }

  if (priceCoordinate !== null && priceCoordinate !== undefined) {
    // Position circle at the data point on the chart line
    const circlePointX = param.point.x - 6; // Center the 12px circle horizontally
    const circlePointY = priceCoordinate - 6; // Center the 12px circle on the price line

    circlePoint.style.left = circlePointX + "px";
    circlePoint.style.top = circlePointY + "px";
    circlePoint.style.display = "block";
  } else {
    circlePoint.style.display = "none";
  }
}
