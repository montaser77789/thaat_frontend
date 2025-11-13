import type {
  PatientStatus,
  TransactionStatus,
} from "../components/consultation_requests/types";

export interface PatientRow {
  id: number;
  patientName: string;
  serviceType: string;
  status: PatientStatus;
  date: string; // "2025-11-11"
  transactionStatus: TransactionStatus;
  paymentMethod: string;
  serviceProviderName: string;
  orderPrice: number;
}

export interface TransactionSummaryData {
  transaction_count: number;
  total_selling_cost: number;
  partner_revenue: number;
  thaat_revenue: number;
  thaat_revenue_percentage: number;
  average_revenue: number;
  average_sales: number;
  patients_count: number;
  purchase_frequency: number;
  retention: number;
};
