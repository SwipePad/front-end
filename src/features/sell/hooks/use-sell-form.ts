import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sellFormSchema = z.object({
  // currentBalance: z.string().min(1, "required"),
  amount: z.string().min(1, "required"),
  slippage: z.string().min(1, "required"),
});
// .refine(
//   (data) => {
//     const amount = parseFloat(
//       data.amount?.slice(0, -data.symbol.length)?.replace(/,/g, ""),
//     );
//     const currentBalance = parseFloat(
//       data.currentBalance?.slice(0, -data.symbol.length)?.replace(/,/g, ""),
//     );
//     return amount <= currentBalance;
//   },
//   {
//     message: "Insufficient balance",
//     path: ["amount"],
//   },
// );

export type SellFormValues = z.infer<typeof sellFormSchema>;

type UseSellFormProps = {
  defaultValues?: SellFormValues;
};

export const useSellForm = ({ defaultValues }: UseSellFormProps) => {
  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
    defaultValues,
  });

  const parseAmount = (amount?: string, symbol?: string) => {
    if (!amount || !symbol) return 0;
    return parseFloat(amount.slice(0, -symbol.length)?.replace(/,/g, ""));
  };

  return {
    form,
    parseAmount,
  };
};
