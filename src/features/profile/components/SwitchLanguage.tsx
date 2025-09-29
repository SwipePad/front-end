import { BottomDraw } from "@/components/shared/bottom-draw";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type SwitchLanguageModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (selectedLanguage: string) => void;
};

const languages = [
  { value: "en", label: "English", nationalFlag: "🇬🇧" },
  { value: "es", label: "Spanish", nationalFlag: "🇪🇸" },
  { value: "id", label: "Indonesian", nationalFlag: "🇮🇩" },
  { value: "pt", label: "Portuguese", nationalFlag: "🇵🇹" },
  { value: "ms", label: "Malay", nationalFlag: "🇲🇾" },
  { value: "th", label: "Thai", nationalFlag: "🇹🇭" },
];

const SwitchLanguageModal = ({
  open,
  setOpen,
  selectedLanguage,
  setSelectedLanguage,
}: SwitchLanguageModalProps) => {
  const { t } = useTranslation();
  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)} title={t("profile.selectLanguage")}>
      <div className="flex flex-col gap-1 px-4">
        {languages.map(language => {
          const isSelected = language.value === selectedLanguage;

          return (
            <div
              className="flex items-center gap-2 py-2.5"
              onClick={() => {
                setSelectedLanguage(language.value);
                setOpen(false);
              }}
              key={language.value}
            >
              {language.nationalFlag}
              <p className="text-sm font-medium uppercase text-[#141416]">{language.label}</p>

              <div
                className={cn(
                  "ml-auto flex h-5 w-5 items-center justify-center rounded-full border border-[#D2D5DA]",
                  isSelected ? "border-none bg-black" : "bg-white"
                )}
              >
                <div className="h-1/2 w-1/2 rounded-full bg-white"></div>
              </div>
            </div>
          );
        })}
      </div>
    </BottomDraw>
  );
};

export default SwitchLanguageModal;
