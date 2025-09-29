import { useUser } from "@/components/providers/user-provider";
import { Header } from "@/components/shared/header";
import { toast } from "@/components/shared/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditForm } from "@/features/profile-edit/hooks/use-edit-form";
import { formatImageUrl } from "@/lib/utils";
import { useFileUploadControllerUploadSingle, useUserControllerUpdate } from "@/services/queries";
import { useNavigate } from "@tanstack/react-router";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { get } from "es-toolkit/compat";
import { useState } from "react";
import { useProfileContext } from "../profile/profile.context";
import { Image } from "@/components/ui/image";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";
import UploadImageIcon from "@/assets/icons/upload-image.svg?react";

export default function ProfileEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useProfileContext();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(data.avatar);
  const [backgroundPreview, setBackgroundPreview] = useState<string | undefined>(data.background);
  const [saveState, setSaveState] = useState<string | undefined>(undefined);
  const { address } = useUser();
  const { form } = useEditForm({
    initialValues: {
      username: data.name || "",
      bio: data.bio || "",
      avatar: data.avatar || "",
      // background: data.background || "/images/profile/bg1.png",
    },
  });

  const uploadMutation = useFileUploadControllerUploadSingle({});
  const { mutateAsync: updateUser } = useUserControllerUpdate();
  const onSubmit = form.handleSubmit(async data => {
    try {
      setSaveState("pending");
      await updateUser({
        data: {
          name: data.username,
          bio: data.bio,
          ...(data.avatar ? { image: data.avatar } : {}),
          ...(data.background ? { background: data.background } : {}),
        },
      });
      toast.success(t("profile.profileUpdatedSuccessfully"));
      sendHapticAction("notification", "success");
      setSaveState("success");
      navigate({ to: `/profile/${address}` });
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Handle error (e.g., show a toast notification)
      sendHapticAction("notification", "error");
      toast.error(t("profile.failedToUpdateProfile"));
      setSaveState(undefined);
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("createToken.fileSizeExceeds2MBLimit"));
      return;
    }

    try {
      // Create blob for upload
      const blob = new Blob([file], { type: file.type });

      // Upload file
      const response = await uploadMutation.mutateAsync({
        data: {
          file: blob,
        },
      });

      // Set the uploaded file URL in the form
      const fileUrl = get(response, ["fileName"], "");
      const formattedUrl = formatImageUrl(fileUrl);
      if (e.target.name === "avatar") {
        form.setValue("avatar", formattedUrl);
        setAvatarPreview(formattedUrl);
      }

      if (e.target.name === "background") {
        form.setValue("background", formattedUrl);
        setBackgroundPreview(formattedUrl);
      }
    } catch (error) {
      sendHapticAction("notification", "error");
      toast.error(t("profile.failedToUploadFile"));
      console.error("File upload error:", error);
    }
  };

  return (
    <section className="rounded-t-2xl">
      <Header title={t("profile.editProfile")} />

      <Form {...form}>
        <form id="profile-edit-form" onSubmit={onSubmit}>
          <div className="space-y-3 px-4">
            <div
              className="h-[145px] w-full overflow-hidden rounded-2xl"
              onClick={() => {
                const input = document.querySelector(
                  'input[name="background"]'
                ) as HTMLInputElement;
                input.click();
              }}
            >
              <Image
                src={backgroundPreview}
                alt="background"
                className="max-h-[145px] w-full object-cover"
              />
              <input
                name="background"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/gif"
                onChange={handleFileChange}
              />
            </div>

            <div className="relative mx-auto !-mt-9 flex h-[62px] w-[62px] items-center justify-center rounded-xl bg-white !p-2">
              <div
                className="absolute left-0 top-0 h-full w-full rounded-xl"
                style={{ background: "rgba(140, 138, 138, 0.32)", zIndex: 2, height: "100%" }}
              ></div>
              <div
                className="mx-auto h-14 w-14 rounded-xl"
                onClick={() => {
                  const input = document.querySelector('input[name="avatar"]') as HTMLInputElement;
                  input.click();
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"
                  style={{ background: "rgba(255, 255, 255, 0.32)" }}
                >
                  <UploadImageIcon className="min-h-4 min-w-4 text-[#FFFFFF]" />
                </div>

                <Image
                  src={avatarPreview}
                  alt="avatar"
                  className="max-h-14 min-h-14 min-w-14 max-w-14 rounded-xl object-cover"
                />
                <input
                  name="avatar"
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/gif"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.bio")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      <div className="fixed bottom-[98px] left-0 right-0 bg-white px-4 py-3">
        <LiveFeedback
          className="w-full"
          label={{
            failed: "Failed",
            pending: "Pending",
            success: "Success",
          }}
          state={saveState as any}
        >
          <Button className="w-full" type="submit" form="profile-edit-form">
            {t("profile.save")}
          </Button>
        </LiveFeedback>
      </div>
    </section>
  );
}
