import { z } from "zod";
import i18n from "i18next";

export const createTokenSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, i18n.t("toaster.form.tokenNameIsRequired"))
    .max(10, i18n.t("toaster.form.tokenNameIsTooLong")),
  tags: z.string().min(1, i18n.t("toaster.form.tagsAreRequired")),
  symbol: z
    .string()
    .min(1, i18n.t("toaster.form.tokenSymbolIsRequired"))
    .max(6, i18n.t("toaster.form.tokenSymbolMustBeLessThan6Characters"))
    .regex(
      /^[A-Z0-9]+$/,
      i18n.t("toaster.form.tokenSymbolMustContainOnlyUppercaseLettersAndNumbers")
    ),
  description: z.string().trim().max(100, i18n.t("toaster.form.maxDescriptionLength")).optional(),
  initBuy: z
    .string()
    .refine(
      val => {
        if (!val || val.trim() === "") return true; // Allow empty for optional
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 1050;
      },
      {
        message: i18n.t("toaster.form.maxInitBuy"),
        params: { max: 1050 },
      }
    )
    .optional()
    .default("0"),
  // logo: z.string().min(1, i18n.t("toaster.form.tokenLogoIsRequired")),
  // website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  // telegram: z.string().url("Invalid Telegram URL").optional().or(z.literal("")),
  // twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
});
export type CreateTokenFormData = z.infer<typeof createTokenSchema>;

export const bannerSchema = z.object({
  caption: z.string().optional(),
  // whoCanSee: z.enum(["public", "followers", "friends", "onlyYou"]).default("public"),
  // allowComments: z.boolean().default(true),
  logo: z.string().min(1, i18n.t("toaster.form.tokenLogoIsRequired")),
  logoPreview: z.string().optional(),
  banner: z.string().min(1, i18n.t("toaster.form.bannerIsRequired")),
  bannerPreview: z.string().optional(),
});

export type BannerFormData = z.infer<typeof bannerSchema>;
