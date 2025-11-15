// تعريف نوع البيانات للشريك
export interface Partner {
  id: number;
  name: string;
  name_locale: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_number: number;
  status: 'ACTIVE' | 'INACTIVE'; 
  password: string;
  cr_number: string;
  address: string;
  location: string;
  vat_number: string;
  moh_number: string;
  country_id: number;
  city_id: number;
  logo_url: string;
  cr_document_url: string;
  vat_document_url: string;
  moh_document_url: string;
  agreement_document_url: string;
  other_document_url: string;
}