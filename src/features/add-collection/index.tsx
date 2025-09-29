import { Header } from "@/components/shared/header";
import { toast } from "@/components/shared/toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddCollectionForm } from "@/features/add-collection/hooks/use-add-collection-form";
import { useAlbumControllerCreateAlbum } from "@/services/queries";
import { useRouter } from "@tanstack/react-router";
import { Button, Switch } from "@worldcoin/mini-apps-ui-kit-react";
import { Lock, LockOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
// import { useState } from "react";

export const AddCollection = () => {
  const { t } = useTranslation();
  const { form } = useAddCollectionForm();
  const router = useRouter();
  // const [openToastSuccess, setOpenToastSuccess] = useState(false);
  const { mutateAsync } = useAlbumControllerCreateAlbum();
  const handleSubmit = form.handleSubmit(async data => {
    try {
      await mutateAsync({
        data: {
          isPublic: !data.isPrivate,
          name: data.name,
        },
      });

      toast.success(t("addCollection.collectionCreatedSuccessfully"));

      // setOpenToastSuccess(true);
      router.history.back();
    } catch (error) {
      console.error("Error creating collection:", error);
      // Handle error (e.g., show a toast notification)
      toast.error(t("addCollection.failedToCreateCollection"));
    }
  });
  return (
    <section className="space-y-4 rounded-t-2xl">
      <Header title={t("addCollection.title")} />

      <Form {...form}>
        <form onSubmit={handleSubmit} id="add-collection-form">
          <div className="space-y-4 px-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#141416]">
                    {t("addCollection.collectionName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("addCollection.collectionNamePlaceholder")}
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#141416]">
                    {t("addCollection.visibility")}
                  </FormLabel>
                  <FormControl>
                    <div className="flex w-full items-center justify-between gap-2 rounded-full border border-[#E5E5E5] px-3 py-2">
                      <div className="flex items-center gap-2">
                        {field.value ? (
                          <Lock className="size-5" />
                        ) : (
                          <LockOpen className="size-5" />
                        )}
                        <p className="font-medium text-[#141416]">
                          {t("addCollection.keepItPrivate")}
                        </p>
                      </div>

                      <Switch checked={field.value} onChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      <div className="fixed bottom-[100px] left-0 m-4 w-[-webkit-fill-available]">
        <Button form="add-collection-form" type="submit" className="w-full rounded-full">
          {t("addCollection.createCollection")}
        </Button>
      </div>
    </section>
  );
};
