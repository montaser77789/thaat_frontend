import { z } from "zod";

// schema لأيام العمل - صحح week_days ليكون array
export const workingHoursSchema = z.object({
  week_days: z.array(z.string()).min(1, "At least one day is required"), // تغيير من string إلى array
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
});

export const branchSchema = z.object({
  // جميع الحقول مطلوبة مع قيم افتراضية صريحة
  name: z.string().min(1, "Name is required"),
  status: z.string().min(1, "Status is required"),
  partner_id: z.string().min(1, "Partner is required"),
  city_id: z.string().min(1, "City is required"),
  contact_person_name: z.string().min(1, "Contact person name is required"),
  contact_person_number: z.string().min(10, "Phone number is required"),
  contact_person_email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(1, "Address is required"),
  categories: z.array(z.string()).min(1, "At least one catagory is required"),

  // الحقول التي كانت اختيارية - اجعلها مطلوبة مع قيم افتراضية
  name_locale: z.string().default(""),
  phone: z.string().default(""),
  mobile: z.string().default(""),
  email: z.string().email("Valid email is required").default(""),
  latitude: z.string().default(""),
  longitude: z.string().default(""),
  location: z.string().default(""),

  working_hours_per_day: z.array(workingHoursSchema).default([]),
});

// نوع البيانات المستنتج من الـ schema
export type BranchFormData = z.infer<typeof branchSchema>;

// قيم افتراضية صريحة متوافقة مع النوع
export const defaultBranchValues: BranchFormData = {
  name: "",
  address: "",
  city_id: "",
  contact_person_email: "",
  contact_person_number: "",
  contact_person_name: "",
  name_locale: "",
  phone: "",
  mobile: "",
  email: "",
  password: "",
  status: "ACTIVE",
  working_hours_per_day: [],
  latitude: "",
  longitude: "",
  location: "",
  partner_id: "",
  categories: [],
};