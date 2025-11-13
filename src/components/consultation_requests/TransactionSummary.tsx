import React from "react";
import {
  FiTrendingUp,
  FiShoppingCart,
  FiDollarSign,
  FiPieChart,
  FiPercent,
  FiBarChart2,
  FiActivity,
  FiUsers,
  FiRepeat,
  FiRefreshCcw,
} from "react-icons/fi";

type SummaryCardProps = {
  title: string;
  value: string;
  children: React.ReactNode;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, children }) => (
  <div className="flex items-center gap-4 overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm md:px-6">
    {children}
    <div className="flex flex-col">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  </div>
);

type TransactionSummaryData = {
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

function TransactionSummary({
  mockTransactionData,
}: {
  mockTransactionData: TransactionSummaryData;
}) {
  return (
    <div className="space-y-5">
      {/* === Summary cards row 1 === */}
      <dl className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {/* Transactions */}
        <SummaryCard
          title="Transactions"
          value={mockTransactionData.transaction_count.toString()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
            <FiTrendingUp className="h-7 w-7 text-indigo-600" />
          </div>
        </SummaryCard>

        {/* Sales */}
        <SummaryCard
          title="Sales"
          value={mockTransactionData.total_selling_cost.toString()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <FiShoppingCart className="h-7 w-7 text-emerald-600" />
          </div>
        </SummaryCard>

        {/* Partner Revenue */}
        <SummaryCard
          title="Partner Revenue"
          value={mockTransactionData.partner_revenue.toString()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50">
            <FiDollarSign className="h-7 w-7 text-sky-600" />
          </div>
        </SummaryCard>

        {/* Thaat Revenue */}
        <SummaryCard
          title="Thaat Revenue"
          value={mockTransactionData.thaat_revenue.toString()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <FiPieChart className="h-7 w-7 text-amber-500" />
          </div>
        </SummaryCard>
      </dl>

      {/* === Summary cards row 2 === */}
      <dl className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {/* Thaat Percentage */}
        <SummaryCard
          title="Thaat Percentage"
          value={`${mockTransactionData.thaat_revenue_percentage}%`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50">
            <FiPercent className="h-7 w-7 text-pink-500" />
          </div>
        </SummaryCard>

        {/* Avg Revenue */}
        <SummaryCard
          title="Avg Revenue"
          value={mockTransactionData.average_revenue.toString()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
            <FiBarChart2 className="h-7 w-7 text-purple-600" />
          </div>
        </SummaryCard>

        {/* Avg Sales */}
        <SummaryCard
          title="Avg Sales"
          value={mockTransactionData.average_sales.toString()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <FiActivity className="h-7 w-7 text-green-600" />
          </div>
        </SummaryCard>

        {/* Patients */}
        <SummaryCard
          title="Patients"
          value={mockTransactionData.patients_count.toString()}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <FiUsers className="h-7 w-7 text-red-500" />
          </div>
        </SummaryCard>
      </dl>

      {/* === Summary cards row 3 === */}
      <dl className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Purchase Frequency */}
        <SummaryCard
          title="Purchase Frequency"
          value={mockTransactionData.purchase_frequency.toFixed(2)}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50">
            <FiRepeat className="h-7 w-7 text-sky-600" />
          </div>
        </SummaryCard>

        {/* Retention */}
        <SummaryCard
          title="Retention"
          value={`${mockTransactionData.retention.toFixed(2)}%`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
            <FiRefreshCcw className="h-7 w-7 text-yellow-600" />
          </div>
        </SummaryCard>
      </dl>
    </div>
  );
}

export default TransactionSummary;
