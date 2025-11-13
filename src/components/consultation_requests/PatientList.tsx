import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ActionOption, PatientStatus } from "./types";
import type { PatientRow } from "../../interfaces/indrx";
import { FiCheckCircle, FiFilter } from "react-icons/fi";

// ================== Options ==================
const PATIENT_STATUS_OPTIONS: PatientStatus[] = [
  "New Order",
  "Under Revision",
  "Dispatch To Service Provider",
  "Order Confirmed",
  "Invoice Sent",
  "Payment Completed",
  "Medical Team On The Way",
];

const TRANSACTION_STATUS_OPTIONS = [
  "Successful",
  "Pending",
  "Cancelled",
  "Refunded",
];

const PAYMENT_METHOD_OPTIONS = ["Cash", "Online", "Card", "Wallet"];

const ACTION_OPTIONS: ActionOption[] = [
  "View Details",
  "Duplicate",
  "Location Link",
  "Send to SP",
  "Child Appointment",
  "Send to Teams",
];

export default function PatientList({ rows }: { rows: PatientRow[] }) {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // ================== Filters state ==================
  const [patientStatusFilter, setPatientStatusFilter] = useState<string>("");
  const [transactionStatusFilter, setTransactionStatusFilter] =
    useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");
  const [partnerFilter, setPartnerFilter] = useState<string>("");
  const [createdFrom, setCreatedFrom] = useState<string>("");
  const [createdTo, setCreatedTo] = useState<string>("");
  const [transactionFrom, setTransactionFrom] = useState<string>("");
  const [transactionTo, setTransactionTo] = useState<string>("");

  const filtersApplied = useMemo(
    () =>
      Boolean(
        patientStatusFilter ||
          transactionStatusFilter ||
          paymentMethodFilter ||
          partnerFilter ||
          createdFrom ||
          createdTo ||
          transactionFrom ||
          transactionTo
      ),
    [
      patientStatusFilter,
      transactionStatusFilter,
      paymentMethodFilter,
      partnerFilter,
      createdFrom,
      createdTo,
      transactionFrom,
      transactionTo,
    ]
  );

  const handleResetFilters = () => {
    setPatientStatusFilter("");
    setTransactionStatusFilter("");
    setPaymentMethodFilter("");
    setPartnerFilter("");
    setCreatedFrom("");
    setCreatedTo("");
    setTransactionFrom("");
    setTransactionTo("");
  };

  const handleApplyFilters = () => {
    console.log("Apply filters", {
      patientStatusFilter,
      transactionStatusFilter,
      paymentMethodFilter,
      partnerFilter,
      createdFrom,
      createdTo,
      transactionFrom,
      transactionTo,
    });
    setShowFilters(false);
  };

  // ================== Row state (status / actions) ==================
  const [statuses, setStatuses] = useState<Record<number, PatientStatus>>(() =>
    rows.reduce(
      (acc, row) => ({ ...acc, [row.id]: row.status }),
      {} as Record<number, PatientStatus>
    )
  );

  const handleStatusChange = (id: number, newStatus: PatientStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    console.log("Change status", { id, newStatus });
  };

  const handleActionChange = (id: number, action: ActionOption) => {
    if (!action) return;

    console.log("Row action", { id, action });

    switch (action) {
      case "View Details":
        navigate(
          `/admins/consultation_requests?payment_status_in=1&patient_id=${id}`
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="">
      <div className="rounded-lg bg-white shadow-lg border border-gray-200">
        {/* Header */}

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Patient Records
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Medical appointments and patient management
              </p>
            </div>

            {/* Filters button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
              >
                {filtersApplied ? (
                  <FiCheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <FiFilter className="h-4 w-4 text-gray-500" />
                )}
                <span>Filters</span>
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-xl border border-gray-200 z-20">
                  <div className="p-4 space-y-4">
                    {/* Patient Status Filters */}
                    <div>
                      <p className="text-xs font-semibold text-gray-800 mb-2">
                        Patient Status
                      </p>
                      <select
                        value={patientStatusFilter}
                        onChange={(e) => setPatientStatusFilter(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Patient Status</option>
                        {PATIENT_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Transaction Status Filters */}
                    <div>
                      <p className="text-xs font-semibold text-gray-800 mb-2">
                        Transaction Status
                      </p>
                      <select
                        value={transactionStatusFilter}
                        onChange={(e) =>
                          setTransactionStatusFilter(e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Payment Status</option>
                        {TRANSACTION_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Method Filters */}
                    <div>
                      <p className="text-xs font-semibold text-gray-800 mb-2">
                        Payment Method
                      </p>
                      <select
                        value={paymentMethodFilter}
                        onChange={(e) => setPaymentMethodFilter(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Payment Method</option>
                        {PAYMENT_METHOD_OPTIONS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="flex-1 rounded-lg border border-gray-400 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyFilters}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Container: الاسكرول الأفقي هنا بس */}
        <div className="overflow-auto rounded-lg  mt-2 shadow-sm">
          <table className=" text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-linear-to-r from-blue-800 to-blue-400 text-white">
                <Th className="text-center">ID</Th>
                <Th>Patient Name</Th>
                <Th>Types of Services/Symptoms</Th>
                <Th>Patient Status</Th>
                <Th className="text-center">Date</Th>
                <Th className="text-center">Transaction Status</Th>
                <Th className="text-center">Payment Method</Th>
                <Th className="text-center">Service Provider</Th>
                <Th className="text-center">Order Price</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <Td className="text-center font-bold text-blue-600">
                      {row.id}
                    </Td>
                    <Td className="font-semibold text-gray-900">
                      {row.patientName}
                    </Td>
                    <Td className="text-gray-700">{row.serviceType}</Td>

                    {/* Patient Status */}
                    <Td>
                      <select
                        value={statuses[row.id]}
                        onChange={(e) =>
                          handleStatusChange(
                            row.id,
                            e.target.value as PatientStatus
                          )
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {PATIENT_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </Td>

                    <Td className="text-center whitespace-nowrap">
                      {row.date}
                    </Td>

                    {/* Transaction Status badge */}
                    <Td className="text-center">
                      {row.transactionStatus === "Successful" ? (
                        <span className="inline-flex items-center rounded-full border border-green-400 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          Successful
                        </span>
                      ) : row.transactionStatus === "-" ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-yellow-400 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                          {row.transactionStatus}
                        </span>
                      )}
                    </Td>

                    <Td className="text-center">{row.paymentMethod}</Td>
                    <Td className="text-center">{row.serviceProviderName}</Td>
                    <Td className="text-center font-bold text-green-600">
                      {row.orderPrice}
                    </Td>

                    {/* Actions */}
                    <Td className="text-center">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const value = e.target.value as ActionOption | "";
                          if (!value) return;
                          handleActionChange(row.id, value as ActionOption);
                          e.currentTarget.value = "";
                        }}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
                      >
                        <option value="" disabled>
                          Actions
                        </option>
                        {ACTION_OPTIONS.map((action) => (
                          <option key={action} value={action}>
                            {action}
                          </option>
                        ))}
                      </select>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="h-24 text-center text-gray-500 text-base font-semibold"
                  >
                    No Patient Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing 1–{rows.length} of {rows.length}
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg border border-blue-500 bg-blue-50 text-sm font-medium text-blue-700">
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= Small helpers =============
const Th: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  children,
  ...rest
}) => (
  <th
    className={`px-4 py-3 text-sm font-bold uppercase tracking-wide ${className}`}
    {...rest}
  >
    {children}
  </th>
);

const Td: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  children,
  ...rest
}) => (
  <td className={`px-4 py-3 ${className}`} {...rest}>
    {children}
  </td>
);
