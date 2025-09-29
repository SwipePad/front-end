import { MiniKit, SendHapticFeedbackInput } from "@worldcoin/minikit-js";

export const sendHapticAction = (hapticsType: string = "impact", style: string = "light") => {
  MiniKit.commands.sendHapticFeedback({
    hapticsType: hapticsType,
    style: style,
  } as SendHapticFeedbackInput);
};
