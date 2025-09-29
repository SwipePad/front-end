const WORLD_CHAT_APP_ID = "app_e293fcd0565f45ca296aa317212d8741";

export function getWorldChatDeeplinkUrl({
  username,
  message,
}: {
  username: string;
  message?: string;
}) {
  let path = `/${username}/draft`;

  if (message) {
    path += `?message=${message}`;
  }

  const encodedPath = encodeURIComponent(path);
  return `https://worldcoin.org/mini-app?app_id=${WORLD_CHAT_APP_ID}&path=${encodedPath}`;
}
