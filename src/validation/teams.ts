// validation/specialist.ts
import z from "zod";

// Schema للإنشاء (جميع الحقول مطلوبة)
const createTeamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  status: z.string().min(1, "Status is required"),
  city_id: z.string().min(1, "City is required"),
  partenerId: z.string().min(1, "Partner is required"),
  medical_branch_id: z.string().min(1, "Branch is required"),
  specialistsIds: z.array(z.string()).min(1, "Specialist is required"),
});

// Schema للتعديل (الحقول الاختيارية)
const updateTeamSchema = z.object({
  name: z.string().optional(),
  name_ar: z.string().optional(),
  status: z.string().optional(),
  city_id: z.string().optional(),
  partenerId: z.string().optional(),
  medical_branch_id: z.string().optional(),
  specialistsIds: z.array(z.string()).optional(),
  
});

// دالة لاختيار الـ schema المناسب
export const getTeamSchema = (isEditMode: boolean) => {
  return isEditMode ? updateTeamSchema : createTeamSchema;
};

export type createTeamSchemaFormData = z.infer<typeof createTeamSchema>;
export type updateTeamSchemaFormData = z.infer<typeof updateTeamSchema>;
