import { z } from "zod";

export const waitlistSchema = z.object({
  name: z.string().min(1, "Name is required").max(25),
  age: z.coerce.number().min(10).max(100),
  userType: z.enum(["Corporate", "School Student", "College Student", "Researcher"]),
  orgName: z.string().min(1, "Organization name is required"),
  city: z.string().min(1, "City is required"),
  email: z.email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  updates: z.boolean(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
