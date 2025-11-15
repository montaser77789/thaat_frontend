export interface ConsultationRequest {
  id: number;
  name: string;
  phone_number: string;
  neighborhood: string | null;
  address: string | null;
  additional_details: string | null;
  status: number;
  age: number | null;
  gender: string | null;
  service_provider_name: string | null;
  selling_cost: number | null;
  service_provider_cost: number | null;
  time_slot: string | null; // ISO string
  admin_details: string | null;
  location: string | null;
  service_date: string | null; // ISO string
  service_id: number;
  specialist_id: number | null;
  city_id: number | null;
  appointment_id: number | null;
  thaat_percentage: number;
  percentage_type: string | null;
  sale_price: number | null;
  transaction_date: string | null;
  items_list: unknown | null;
  location_link_added: boolean;
  send_to_specialist: boolean;
  is_mobile_request: boolean;
  is_web_request: boolean;
  created_by: number;
  patient_status: string | null;
  teams_status: string | null;
  status_label: string | null;
  arrival_time: string | null;
  payment_link: string | null;
  payment_method: string | null;
  payment_status: string | null;
  parent_id: number | null;
  created_at: string; // ISO
  updated_at: string; // ISO
  service :{
    id: number,
    name: string
  }
}

export interface ConsultationRequestsPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface ConsultationRequestsResponse {
  status: "success" | "error";
  message: string;
  data: ConsultationRequest[];
  pagination: ConsultationRequestsPagination;
}
