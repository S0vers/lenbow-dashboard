import z from "zod";

import { validateString } from "@/validators/commonRule";

export const currencyUpdateSchema = z.object({
	currency: validateString("Currency", { min: 3, max: 3 })
});

export type CurrencyUpdateSchema = z.infer<typeof currencyUpdateSchema>;
