import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import i18n from "i18next";

const AddCollectionSchema = z.object({
  name: z.string().min(1, i18n.t("toaster.form.nameRequired")),
  isPrivate: z.boolean().default(false),
});

type AddCollectionFormValues = z.infer<typeof AddCollectionSchema>;
export const useAddCollectionForm = () => {
  const form = useForm<AddCollectionFormValues>({
    resolver: zodResolver(AddCollectionSchema),
    defaultValues: {
      name: "",
      isPrivate: false,
    },
  });

  return {
    form,
  };
};
