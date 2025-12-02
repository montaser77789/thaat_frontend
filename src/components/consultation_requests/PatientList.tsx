import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiFilter, FiSearch } from "react-icons/fi";

import {
  useGetConsultationRequestsQuery,
  useSendWhatsappMessageMutation,
} from "../../app/Api/Slices/ConsultationApiSlice";
import { PaginationControls } from "../ui/PaginationControls";

import type { ActionOption, PatientStatus, TransactionStatus } from "./types";
import type { PatientRow } from "../../interfaces/indrx";
import type { ConsultationRequest } from "../../interfaces/consultationRequest";
import { Td, Th } from "../ui/Tables";
import { toast } from "react-toastify";

// ================== Types / Maps ==================

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
const PATIENT_STATUS_OPTIONS: PatientStatus[] = [
  "Select Status",
  "New Order",
  "Under Revision",
  "Dispatch To Service Provider",
  "Order Confirmed",
  "Invoice Sent",
  "Payment Completed",
  "Medical Team On The Way",
  "Medical Team Arrived",
  "Service Completed and Service Rating",
  "Follow Up Services",
  "Scheduling Additional Services",
  "Cancelled",
  "Refunded",
  "Cancelled By Thaat",
];

const STATUS_MAP: Record<number, PatientStatus> = {
  0: "New Order",
  1: "Under Revision",
  2: "Dispatch To Service Provider",
  3: "Order Confirmed",
  4: "Invoice Sent",
  5: "Payment Completed",
  6: "Medical Team On The Way",
  7: "Medical Team Arrived",
  8: "Service Completed and Service Rating",
  9: "Follow Up Services",
  10: "Scheduling Additional Services",
  12: "Cancelled",
  13: "Refunded",
  14: "Cancelled By Thaat",
  15: "Select Status",
};
const STATUS_TO_TEMPLATE: Record<PatientStatus, string | null> = {
  "Select Status": null,
  "New Order": "new_order_sent",
  "Under Revision": "under_revision",
  "Dispatch To Service Provider": "default_template", // مفيش template دلوقتي
  "Order Confirmed": "thaat_service_confirm",
  "Invoice Sent": "thaat_appointment_cash_final",
  "Payment Completed": "thaat_service_payment_completed",
  "Medical Team On The Way": "medical_team_on_the_way",
  "Medical Team Arrived": "medical_team_arrived",
  "Service Completed and Service Rating":
    "service_completed_and_service_rating",
  "Follow Up Services": "follow_up_services",
  "Scheduling Additional Services": "scheduling_additional_services",
  Cancelled: "thaat_service_request_cancelation",
  Refunded: "thaat_service_appointment_refund_clone",
  "Cancelled By Thaat": "thaat_service_request_cancelation",
};

function mapStatus(status: number | null): PatientStatus {
  if (status == null) return "Select Status";
  return STATUS_MAP[status] ?? "Select Status";
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
  console.log("statuses", statuses);

  const [sendWhatsappMessage] = useSendWhatsappMessageMutation();
  const handleStatusForceChange = async (
    id: number,
    newStatus: PatientStatus
  ) => {
    console.log("Change status", { id, newStatus });
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));

    console.log("Change status", { id, newStatus });

    const mappedTemplate = STATUS_TO_TEMPLATE[newStatus];

    if (!mappedTemplate) {
      console.log("No WhatsApp template for:", newStatus);
      return;
    }

    try {
      const res = await sendWhatsappMessage({
        id,
        type: mappedTemplate,
      }).unwrap();

      toast.success(res.message);
      console.log("WhatsApp sent:", res);
    } catch (error) {
      console.error("Failed to send WhatsApp:", error);
    }
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
                      <CustomSelect
                        value={statuses[row.id] ?? row.status}
                        options={PATIENT_STATUS_OPTIONS}
                        onChange={(newValue) => {
                          setStatuses((prev) => ({
                            ...prev,
                            [row.id]: newValue as PatientStatus,
                          }));

                          handleStatusForceChange(row.id, newValue as PatientStatus);
                        }}
                      />
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
                          className="rounded-lg cursor-pointer border bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 min-w-[140px] transition-all  "
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
function CustomSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ✨ Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Selected box */}
      <div
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {value}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 min-w-[230px] rounded-lg border bg-white shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                option === value ? "bg-gray-50 font-medium" : ""
              }`}
              onClick={() => {
                onChange(option); // fires even if selecting same value
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

