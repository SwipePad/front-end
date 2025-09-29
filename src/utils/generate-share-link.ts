export function generateShareLink(tokenAddress: string): string {
  const baseUrl = "https://world.org/mini-app";
  const appId = import.meta.env.VITE_APP_ID;
  const path = encodeURIComponent(`/tokens/${tokenAddress}`);

  return `${baseUrl}?app_id=${appId}&path=${path}`;
}
