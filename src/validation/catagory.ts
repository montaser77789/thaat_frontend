// validation/specialist.ts
import z from "zod";

// Schema للإنشاء (جميع الحقول مطلوبة)
const createCatagorySchema = z.object({
  name_ar: z.string().min(1, "Arabic name is required"),
  name_en: z.string().min(1, "English name is required"),
  file: z.instanceof(File).optional(),
});

// Schema للتعديل (الحقول الاختيارية)
const updateCatagorySchema = z.object({
  name_ar: z.string().optional(),
  name_en: z.string().optional(),
  file: z.instanceof(File).optional(),
});

// دالة لاختيار الـ schema المناسب
export const getCatagorySchema = (isEditMode: boolean) => {
  return isEditMode ? updateCatagorySchema : createCatagorySchema;
};

export type catagorychemaFormData = z.infer<typeof createCatagorySchema>;
export type updateCatagorySchemaFormData = z.infer<typeof updateCatagorySchema>;
