import { z } from "zod";

export function getGiftSchema(): {
  giftSchema: z.ZodObject<{
    name: z.ZodString;
    quantity: z.ZodNumber;
  }>;
  textFieldRule: z.ZodString;
  quantityFieldRule: z.ZodNumber;
} {
  const textFieldRule = z.string().min(1);
  const quantityFieldRule = z.number().int().positive();

  return {
    giftSchema: z.object({
      name: textFieldRule,
      quantity: quantityFieldRule,
      imageUrl: textFieldRule,
      owner: textFieldRule,
      price: quantityFieldRule,
    }),
    textFieldRule,
    quantityFieldRule,
  };
}
