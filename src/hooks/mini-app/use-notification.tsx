import { MiniKit, Permission } from "@worldcoin/minikit-js";

const useNotification = () => {
  const handleNotificationPermission = async () => {
    try {
      const { finalPayload } = await MiniKit.commandsAsync.getPermissions();
      console.log("finalPayload from notification: ", finalPayload);

      if (finalPayload.status === "success" && !finalPayload.permissions?.notifications) {
        const res = await MiniKit.commandsAsync.requestPermission({
          permission: Permission.Notifications,
        });
        console.log("res: ", res);
      }
    } catch (err) {
      console.error("Notification permission error:", err);
    }
  };

  return {
    handleNotificationPermission,
  };
};

export default useNotification;
