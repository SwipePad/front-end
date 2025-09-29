export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const VOTING_LIMIT = 25;
export const DEFAULT_IMAGE = `https://effigy.im/a/${ZERO_ADDRESS}.svg`;

export const FEATURES = {
  VOTING_ENABLED: false, // Set to false to disable voting and enable direct deployment
} as const;

export const listQuickBuyAmount = [0.5, 1, 3, 5];
export const VERIFY_HUMAN_ACTION = "verify-human";
export const MAX_BUY_AMOUNT_NON_HUMAN = 1000000;
