import { z } from "zod";
export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone_number: z.string().min(7),
  role: z.string().optional(),
  refresh_token:z.string().optional(),
  status: z.boolean().optional(),
  isNotification: z.boolean().optional(),
  loginWith: z.string().optional(),
  image: z.string().optional(),
  address_id: z.number().optional(),
  deviceToken: z.string().optional(),
  deviceType: z.string().optional(),
});

export type UserInput = z.infer<typeof UserSchema>;
