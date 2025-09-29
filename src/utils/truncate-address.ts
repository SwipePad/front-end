export default function truncateAddress(
  address?: string,
  showLeftCharAmount = 2,
  showRightCharAmount = 4
): string {
  if (!address) return "";
  const prefix = address.slice(0, 2 + showLeftCharAmount); // "0x" + first N chars
  const suffix = address.slice(-showRightCharAmount);
  return `${prefix}...${suffix}`;
}
