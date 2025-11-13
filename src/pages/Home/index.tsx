import TransactionSummary from "../../components/consultation_requests/TransactionSummary";
import type { PatientRow, TransactionSummaryData } from "../../interfaces/indrx";
const mockPatients: PatientRow[] = [
  {
    id: 2102,
    patientName: "montaser gohar",
    serviceType: "Tabib Doctor at Home",
    status: "New Order",
    date: "2025-11-11",
    transactionStatus: "Successful",
    paymentMethod: "-",
    serviceProviderName: "-",
    orderPrice: 0,
  },
  {
    id: 2101,
    patientName: "Ahmed",
    serviceType: "Filler o Botics 1",
    status: "New Order",
    date: "2025-11-08",
    transactionStatus: "-",
    paymentMethod: "-",
    serviceProviderName: "-",
    orderPrice: 0,
  },
  {
    id: 2100,
    patientName: "Testing Demo 3",
    serviceType: "-",
    status: "New Order",
    date: "2025-11-07",
    transactionStatus: "-",
    paymentMethod: "-",
    serviceProviderName: "-",
    orderPrice: 0,
  },
];

const mockTransactionData: TransactionSummaryData = {
  transaction_count: mockPatients.length,
  total_selling_cost: 0,
  partner_revenue: 0,
  thaat_revenue: 0,
  thaat_revenue_percentage: 0,
  average_revenue: 0,
  average_sales: 0,
  patients_count: mockPatients.length,
  purchase_frequency: 0,
  retention: 0,
};
export default function HomePage() {
  return (
    <div>
      <TransactionSummary mockTransactionData={mockTransactionData} />
    </div>
  );
}
