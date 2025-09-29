import { atom } from "jotai";

const appProviderAtom = atom({
  hiddenBottomNav: false,
});

export const store = {
  appProviderAtom,
};
