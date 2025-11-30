import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiFilter, FiSearch, FiPlus } from "react-icons/fi";

import { useGetConsultationRequestsQuery } from "../../app/Api/Slices/ConsultationApiSlice";
import { PaginationControls } from "../ui/PaginationControls";

import type { ActionOption, PatientStatus, TransactionStatus } from "./types";
import type { PatientRow } from "../../interfaces/indrx";
import type { ConsultationRequest } from "../../interfaces/consultationRequest";
import { Td, Th } from "../ui/Tables";

// ================== Types / Maps ==================

const PATIENT_STATUS_OPTIONS: PatientStatus[] = [
  "New Order",
  "Under Revision",
  "Dispatch To Service Provider",
  "Order Confirmed",
  "Invoice Sent",
  "Payment Completed",
  "Medical Team On The Way",
];

const TRANSACTION_STATUS_OPTIONS: TransactionStatus[] = [
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

const STATUS_MAP: Record<number, PatientStatus> = {
  0: "New Order",
  1: "Under Revision",
  2: "Dispatch To Service Provider",
  3: "Order Confirmed",
  4: "Invoice Sent",
  5: "Payment Completed",
  6: "Medical Team On The Way",
};

function mapStatus(status: number | null): PatientStatus {
  if (status == null) return "New Order";
  return STATUS_MAP[status] ?? "New Order";
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

function mapConsultationToRow(item: ConsultationRequest): PatientRow {
  return {
    id: item.id,
    patientName: item?.name,
    serviceType: item?.service?.name || "-",
    status: mapStatus(item.status),
    date: formatDate(item.created_at),
    transactionStatus: (item.payment_status as TransactionStatus) || "-",
    paymentMethod: item.payment_method || "-",
    serviceProviderName: item.service_provider_name || "-",
    orderPrice: item.selling_cost ?? 0,
  };
}

// ================== Component ==================
export default function PatientList() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");

  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");

  const { data, isLoading } = useGetConsultationRequestsQuery({
    page,
    limit: perPage,
    search: searchQuery || undefined,
  });

  const pagination = data?.pagination ?? {
    total: 0,
    totalPages: 1,
    currentPage: page,
    perPage,
  };

  const totalPages = pagination.totalPages || 1;

  // نحول الداتا اللي جاية من الباك لصفوف الجدول
  const rows: PatientRow[] = (data?.data || []).map(mapConsultationToRow);

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
  const [statuses, setStatuses] = useState<Record<number, PatientStatus>>({});

  const handleStatusChange = (id: number, newStatus: PatientStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    console.log("Change status", { id, newStatus });
  };

  const handleActionChange = (id: number, action: ActionOption) => {
    if (!action) return;

    console.log("Row action", { id, action });

    switch (action) {
      case "View Details":
        navigate(`/admins/consultation_requests/appointment/${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with title and add button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
          <p className="text-gray-600 mt-1">
            Medical appointments and patient management
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name or service..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                <Th className="text-left">ID</Th>
                <Th className="text-left">Patient Name</Th>
                <Th className="text-left">Service Type</Th>
                <Th className="text-left">Status</Th>
                <Th className="text-center">Date</Th>
                <Th className="text-center">Transaction</Th>
                <Th className="text-center">Payment Method</Th>
                <Th className="text-center">Service Provider</Th>
                <Th className="text-center">Order Price</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={10} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading patient records...</p>
                  </Td>
                </tr>
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{row.id}</Td>
                    <Td className="font-medium text-gray-900">
                      {row.patientName}
                    </Td>
                    <Td className="text-gray-700">{row.serviceType}</Td>

                    {/* Patient Status */}
                    <Td>
                      <select
                        value={statuses[row.id] || row.status}
                        onChange={(e) =>
                          handleStatusChange(
                            row.id,
                            e.target.value as PatientStatus
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                      >
                        {PATIENT_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </Td>

                    <Td className="text-center whitespace-nowrap text-gray-600">
                      {row.date}
                    </Td>

                    {/* Transaction Status */}
                    <Td className="text-center">
                      {row.transactionStatus === "Successful" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                          Successful
                        </span>
                      ) : row.transactionStatus === "Pending" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                          Pending
                        </span>
                      ) : row.transactionStatus === "Cancelled" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                          Cancelled
                        </span>
                      ) : row.transactionStatus === "Refunded" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                          Refunded
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </Td>

                    <Td className="text-center text-gray-600">
                      {row.paymentMethod}
                    </Td>

                    <Td className="text-center text-gray-600">
                      {row.serviceProviderName}
                    </Td>

                    <Td className="text-center font-bold text-green-600">
                      ${row.orderPrice.toLocaleString()}
                    </Td>

                    {/* Actions */}
                    <Td>
                      <div className="flex justify-center">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const value = e.target.value as ActionOption | "";
                            if (!value) return;
                            handleActionChange(row.id, value as ActionOption);
                            e.currentTarget.value = "";
                          }}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] transition-all hover:bg-blue-700"
                        >
                          <option value="" disabled>
                            Select Action
                          </option>
                          {ACTION_OPTIONS.map((action) => (
                            <option key={action} value={action}>
                              {action}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={10} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-lg font-semibold">
                        No Patient Data Available
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        No patient records found matching your criteria
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-700 mb-2 md:mb-0">
            Showing <span className="font-medium">{rows.length}</span> of{" "}
            <span className="font-medium">{pagination.total}</span> patients
          </div>

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={(newPage, newPerPage) => {
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set("page", String(newPage));
                params.set("per_page", String(newPerPage));
                if (searchQuery) {
                  params.set("search", searchQuery);
                } else {
                  params.delete("search");
                }
                return params;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
