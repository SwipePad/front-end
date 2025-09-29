import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const buyFormSchema = z.object({
  // currentBalance: z.string().min(1, "required"),
  amount: z.string().min(1, "required"),
  slippage: z.string().min(1, "required"),
  usdAmount: z.string(),
});
// .refine(
//   (data) => {
//     const amount = parseFloat(data.amount?.slice(0, -3)?.replace(/,/g, ""));
//     const currentBalance = parseFloat(
//       data.currentBalance?.slice(0, -3)?.replace(/,/g, ""),
//     );
//     return amount <= currentBalance;
//   },
//   {
//     message: "Insufficient balance",
//     path: ["amount"],
//   },
// );

export type BuyFormValues = z.infer<typeof buyFormSchema>;

type UseBuyFormProps = {
  defaultValues?: BuyFormValues;
};

export const useBuyForm = ({ defaultValues }: UseBuyFormProps) => {
  const form = useForm<BuyFormValues>({
    resolver: zodResolver(buyFormSchema),
    defaultValues,
  });

  return {
    form,
  };
};
