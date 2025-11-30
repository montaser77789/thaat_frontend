// validation/appointment.ts
import z from "zod";

// Schema للإنشاء (جميع الحقول مطلوبة)
const createAppointmentSchema = z.object({
  partener_id: z.string().min(1, "Partner is required"),
  specialist_id: z.string().min(1, "Specialist is required"),
  request_id: z.string().min(1, "Request is required"),
  branch_id: z.string().min(1, "Branch is required"),
  scheduled_at: z.string().min(1, "Date is required"),
  identifier: z.string().min(1, "Identifier is required"),
  age : z.string().min(1, "Age is required"),
  gender : z.string().min(1, "Gender is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  nationality_type: z.string().min(1, "Nationality type is required"),
  nationality: z.string().min(1, "Nationality is required"),
  patment_method: z.string().min(1, "Payment method is required"),
  selling_cost: z.string().min(1, "Selling cost is required"),
  service_provider_cost: z.string().min(1, "Service provider cost is required"),
  discount: z.string().min(1, "Discount is required"),
  payment_link: z.string().optional(),
  transaction_status: z.string().min(1, "Transaction status is required"),
  payment_Date: z.string().optional(),
});

// Schema للتعديل (الحقول الاختيارية)
const updateAppointmentSchema = z.object({
  partener_id: z.string().min(1, "Partner is required"),
  specialist_id: z.string().min(1, "Specialist is required"),
  request_id: z.string().min(1, "Request is required"),
  branch_id: z.string().min(1, "Branch is required"),
  scheduled_at: z.string().optional(),
  identifier: z.string().optional(),
  age : z.string().optional(),
  gender : z.string().optional(),
  date_of_birth: z.string().optional(),
  nationality_type: z.string().optional(),
  nationality: z.string().optional(),
  patment_method: z.string().optional(),
  selling_cost: z.string().optional(),
  service_provider_cost: z.string().optional(),
  payment_link: z.string().optional(),
  discount: z.string().optional(),
  transaction_status: z.string().optional(),
  payment_Date: z.string().optional(),
});

// دالة لاختيار الـ schema المناسب
export const getAppointmentSchema = (isEditMode: boolean) => {
  return isEditMode ? updateAppointmentSchema : createAppointmentSchema;
};

export type createAppointmentSchemaFormData = z.infer<typeof createAppointmentSchema>;
export type updateAppointmentSchemaFormData = z.infer<typeof updateAppointmentSchema>;