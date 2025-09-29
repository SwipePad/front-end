import { MiniKit, SendHapticFeedbackInput } from "@worldcoin/minikit-js";

export const sendHapticFeedbackCommand = (payload: SendHapticFeedbackInput) => {
  MiniKit.commands.sendHapticFeedback(payload);
};
