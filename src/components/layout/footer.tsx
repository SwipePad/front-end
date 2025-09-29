import { Link } from "@tanstack/react-router";
import LogoMascot from "@/assets/icons/logo-mascot.svg?react";
import LogoSymbol from "@/assets/icons/logo-symbol.svg?react";
import IconTelegram from "@/assets/icons/telegram.svg?react";
import IconX from "@/assets/icons/x.svg?react";
import IconMedium from "@/assets/icons/medium.svg?react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    toast.info(t("toaster.commingSoon"));
  };

  return (
    <footer className="mt-20 w-full">
      <div className="container flex flex-col items-start justify-between gap-8 py-8 md:flex-row">
        {/* Logo, Copyright and Social Links */}
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:items-start">
          <div className="flex items-center gap-2">
            <LogoMascot className="h-10 w-auto" />
            <LogoSymbol className="h-10 w-auto" />
          </div>
          <p className="text-sm text-white/60">© 2024 Copyrights by SWIPEPAD all rights reserved.</p>
          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              <IconX className="h-6 w-6" />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              <IconTelegram className="h-6 w-6" />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              <IconMedium className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Navigation Columns Container */}
        <div className="hidden w-full gap-8 sm:grid sm:grid-cols-2 md:flex md:w-auto md:gap-20 lg:gap-40">
          {/* Resources Column */}
          <div className="mt-0">
            <h3 className="mb-4 font-medium text-white">Resources</h3>
            <div className="flex flex-col gap-3">
              <Link
                to=""
                className="text-white/60 transition-colors hover:text-white"
              >
                Documentation
              </Link>
              <Link
                to="#"
                onClick={handleClick}
                className="text-white/60 transition-colors hover:text-white"
              >
                Whitepaper
              </Link>
              <Link
                to="mailto"
                className="text-white/60 transition-colors hover:text-white"
              >
                Email
              </Link>
            </div>
          </div>

          {/* Legal Column */}
          <div className="mt-0">
            <h3 className="mb-4 font-medium text-white">Legal</h3>
            <div className="flex flex-col gap-3">
              <Link
                to="#"
                onClick={handleClick}
                className="text-white/60 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                onClick={handleClick}
                className="text-white/60 transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 rounded-full border border-white/20 bg-black/50 p-2.5 transition-colors hover:bg-white/10 md:static md:mt-0 md:bg-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
};
