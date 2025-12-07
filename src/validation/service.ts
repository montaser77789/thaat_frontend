// service.ts
import z from "zod";

const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cost: z.string().min(1, "Cost is required"),
  price: z.string().min(1, "Price is required"),
  code: z.string().min(1, "Code is required"),
  catagory_id: z.string().min(1, "Category is required"),
  file: z.union([z.instanceof(File), z.null()]).optional(),
});

export default createServiceSchema;

export type ServiceForm = z.infer<typeof createServiceSchema>;