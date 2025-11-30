import { z } from "zod";

export const consultationSchema = z.object({
  name: z.string().min(3, "Name is required"),
  phone_number: z.string().min(10, "Phone number is required"),
  catagory_id: z.string().min(1, "Catagory is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  additional_details: z.string().optional(),
  city_id: z.string().min(1, "City is required"),
});
