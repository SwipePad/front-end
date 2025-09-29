import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";
export { Toaster } from "sonner";

import IconCheck from "@/assets/icons/check.svg?react";
import IconClose from "@/assets/icons/close.svg?react";
import IconError from "@/assets/icons/error.svg?react";
import IconBell from "@/assets/icons/bell.svg?react";

interface CustomToastProps {
  id: string | number;
  title: string;
  description?: string | ReactNode;
}

const DURATION = 4000;

const CustomErrorToast = ({ title, description, id }: CustomToastProps) => (
  <div className="pointer-events-none flex items-start gap-[10px] rounded-2xl border border-[#E6E8EC] bg-white px-5 py-4 before:rounded-2xl">
    <IconError className="h-5 w-5 text-white" />
    <div className="flex-1">
      <p className="font-medium text-black">{title}</p>
      {description && <div className="line-clamp-3 text-sm text-[#777E90]">{description}</div>}
    </div>
    <IconClose
      className="pointer-events-auto mt-1 h-4 w-4 cursor-pointer text-white"
      onClick={() => sonnerToast.dismiss(id)}
    />
  </div>
);

const CustomSuccessToast = ({ title, description, id }: CustomToastProps) => (
  <div className="pointer-events-none flex items-start gap-[10px] rounded-2xl border border-[#E6E8EC] bg-white px-5 py-4 before:rounded-2xl">
    <IconCheck className="h-6 w-6" />
    <div className="flex-1">
      <p className="font-medium text-black">{title}</p>
      {description && <div className="line-clamp-3 text-sm text-[#777E90]">{description}</div>}
    </div>
    <IconClose
      className="pointer-events-auto mt-1 h-4 w-4 cursor-pointer text-white"
      onClick={() => sonnerToast.dismiss(id)}
    />
  </div>
);

const CustomNotificationToast = ({ title, description, id }: CustomToastProps) => (
  <div className="pointer-events-none flex w-[356px] items-center gap-[10px] rounded-2xl border border-[#E6E8EC] bg-[#14100B] px-5 py-4 before:rounded-2xl">
    <IconBell className="h-6 w-6 text-white" />
    <div className="flex-1">
      <p className="text-gradient font-medium uppercase tracking-wide">{title}</p>
      {description && <div className="mt-1 text-sm text-white/80">{description}</div>}
    </div>
    <IconClose
      className="pointer-events-auto mt-1 h-4 w-4 cursor-pointer text-white"
      onClick={() => sonnerToast.dismiss(id)}
    />
  </div>
);

export const toast = {
  ...sonnerToast,
  error: (title: string, description?: string | ReactNode) => {
    return sonnerToast.custom(
      id => <CustomErrorToast id={id} title={title} description={description} />,
      {
        duration: DURATION,
      }
    );
  },
  success: (title: string, description?: string | ReactNode) => {
    return sonnerToast.custom(
      id => <CustomSuccessToast id={id} title={title} description={description} />,
      {
        duration: DURATION,
      }
    );
  },
  notification: (title: string, description?: string | ReactNode) => {
    return sonnerToast.custom(
      id => <CustomNotificationToast id={id} title={title} description={description} />,
      {
        duration: DURATION,
      }
    );
  },
};
