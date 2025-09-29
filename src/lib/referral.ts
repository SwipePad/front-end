const REFERRAL_KEY = "pumpe_referral_address";

export const storeReferralAddress = (address: string) => {
  if (!address) return;
  localStorage.setItem(REFERRAL_KEY, address.toLowerCase());
};

export const getReferralAddress = (): string | null => {
  return localStorage.getItem(REFERRAL_KEY);
};

export const clearReferralAddress = () => {
  localStorage.removeItem(REFERRAL_KEY);
};
