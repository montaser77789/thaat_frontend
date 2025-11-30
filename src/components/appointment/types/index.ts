export interface IAppointment {
  id: number;
  branch_id: number | null;
  status: number;
  scheduled_at: string | null; // ISO Date string
  user_id: number | null;
  age : number | null;
  gender : number | null;
  date_of_birth : string | null;
  nationality_type : number | null;
  nationality : string | null;
  patment_method : number | null;
  selling_cost : number | null;
  service_provider_cost : number | null;
  payment_link : string | null;
  discount : number | null;
  transaction_status : number | null;
  payment_Date : string | null;
  location_link : string | null;
  provider_name : string | null;
  longitude : number | null;
  appointment_items: Record<string, any>[];
  

  payment_details: Record<string, any>;
  reschedule_details: Record<string, any>;

  service_type: number;

  invoice_id: number | null;
  offer_id: number | null;
  identifier: string | null;

  complaint_status: number | null;
  complaint_conversation_id: string | null;
  complaint_contact_id: string | null;

  offer_price: number | null;
  offer_official_price: number | null;
  partial_amount: number | null;
  app_percentage: number | null;
  vendor_percentage: number | null;

  financial_id: number | null;
  purchased_date: string | null;

  address_id: number | null;
  specialist_id: number | null;

  customer_acquisition_fee_amount: number;

  created_at: string;
  updated_at: string;
}
