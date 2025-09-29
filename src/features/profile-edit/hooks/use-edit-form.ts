import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import i18n from "i18next";

const EditFormSchema = z.object({
  username: z.string().min(1, { message: i18n.t("toaster.form.usernameRequired") }),
  bio: z.string().min(1, { message: i18n.t("toaster.form.bioRequired") }),
  avatar: z.string().optional(),
  background: z.string().optional(),
});

type EditFormValues = z.infer<typeof EditFormSchema>;

interface UseEditFormProps {
  initialValues: EditFormValues;
}

export const useEditForm = ({ initialValues }: UseEditFormProps) => {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(EditFormSchema),
    defaultValues: initialValues,
  });

  return {
    form,
  };
};
