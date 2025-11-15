// validation/partener.ts
import { z } from "zod";

export const partenerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_locale: z.string().min(1, "Arabic name is required"),
  contact_person_name: z.string().min(1, "Contact person name is required"),
  contact_person_email: z.string().email("Valid email is required"),
  contact_person_number: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  cr_number: z.string().min(1, "CR number is required"),
  address: z.string().min(1, "Address is required"),
  location: z.string().min(1, "Location is required"),
  vat_number: z.string().optional(),
  moh_number: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  country_id: z.string().min(1, "Country is required"),
  city_id: z.string().min(1, "City is required"),
  logo_url: z.any().optional(),
  cr_document_url: z.any().optional(),
  vat_document_url: z.any().optional(),
  moh_document_url: z.any().optional(),
  agreement_document_url: z.any().optional(),
  other_document_url: z.any().optional(),
});