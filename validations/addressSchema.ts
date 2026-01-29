import { z } from "zod";

export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  area: z.string().optional(),
  pincode: z.string().optional(),
  landmark: z.string().optional(),
});

export type UserInput = z.infer<typeof AddressSchema>;