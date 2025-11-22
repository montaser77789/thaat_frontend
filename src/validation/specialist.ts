// validation/specialist.ts
import z from "zod";

// Schema للإنشاء (جميع الحقول مطلوبة)
const createSpecialistSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  medical_branch_id: z.string().min(1, "Branch is required"),
  logo_url: z.any().optional(),
  id_document: z.any().optional(),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  id_Number: z.string().min(1, "ID Number is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  tracking_link: z.string().min(1, "Tracking link is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  nationality: z.string().min(1, "Nationality is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location_link: z.string().min(1, "Location link is required"),
  description: z.string().min(1, "Description is required"),
  description_locale: z.string().min(1, "Arabic description is required"),
  city_id: z.string().min(1, "City is required"),
});

// Schema للتعديل (الحقول الاختيارية)
const updateSpecialistSchema = z.object({
  partner_id: z.string().optional(),
  medical_branch_id: z.string().optional(),
  logo_url: z.any().optional(),
  id_document: z.any().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  id_Number: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  tracking_link: z.string().optional(),
  mobile: z.string().optional(),
  nationality: z.string().optional(),
  email: z.string().email("Valid email is required").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  location_link: z.string().optional(),
  description: z.string().optional(),
  description_locale: z.string().optional(),
  city_id: z.string().optional(),
});

// دالة لاختيار الـ schema المناسب
export const getSpecialistSchema = (isEditMode: boolean) => {
  return isEditMode ? updateSpecialistSchema : createSpecialistSchema;
};

export type SpecialistFormData = z.infer<typeof createSpecialistSchema>;
export type UpdateSpecialistFormData = z.infer<typeof updateSpecialistSchema>;