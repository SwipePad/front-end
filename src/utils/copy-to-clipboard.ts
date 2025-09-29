export default function copyToClipboard(text?: string) {
  if (!text) return;
  navigator.clipboard.writeText(text);
}
