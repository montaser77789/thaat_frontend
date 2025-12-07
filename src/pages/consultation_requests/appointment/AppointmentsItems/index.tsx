import  { useState } from "react";
import { useGetappointmentItemServiceQuery } from "../../../../app/Api/Slices/appointmentApiSlice";
import { Td, Th } from "../../../../components/ui/Tables";
import {
  FiPackage,
  FiTool,
  FiPlus,
} from "react-icons/fi";
import Services from "../../../services";

// Tab 1: عرض الخدمات المضافة
const AppointmentsItemsTab = () => {
  const { data, isLoading, error } = useGetappointmentItemServiceQuery({});

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <Th>ID</Th>
                <Th>Appointment ID</Th>
                <Th>Item Details</Th>
                <Th>Cost</Th>
                <Th>Price</Th>
                <Th>Qty</Th>
                <Th>Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading appointment items...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={8} className="text-center py-8 text-red-500">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-2">⚠️</div>
                      <p className="font-medium">
                        Error loading appointment items
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Please try again later
                      </p>
                    </div>
                  </Td>
                </tr>
              ) : data?.data?.length > 0 ? (
                data.data.map((item: any) => {
                  const isStandardService = !!item.service_id;
                  const itemName = isStandardService
                    ? item.service?.name
                    : item.custom_name || "Custom Item";

                  const code = isStandardService
                    ? item.service?.code || "-"
                    : "CUSTOM";
                  const cost = parseFloat(
                    item.custom_cost || item.service?.cost || 0
                  );
                  const price = parseFloat(
                    item.custom_price || item.service?.price || 0
                  );
                  const quantity = item.quantity || 1;
                  const total = price * quantity;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <Td className="font-medium text-gray-900">
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">#</span>
                          {item.id}
                        </div>
                      </Td>
                      <Td className="font-medium text-gray-900">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          APPT-{item.appointment_id}
                        </div>
                      </Td>
                      <Td>
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isStandardService
                                ? "bg-blue-50 text-blue-600"
                                : "bg-yellow-50 text-yellow-600"
                            }`}
                          >
                            {isStandardService ? (
                              <FiPackage size={16} />
                            ) : (
                              <FiTool size={16} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900 truncate">
                                {itemName}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  isStandardService
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {isStandardService ? "Standard" : "Custom"}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <span className="truncate">Code: {code}</span>
                              {isStandardService && item.service_id && (
                                <span className="mx-2">•</span>
                              )}
                              {isStandardService && item.service_id && (
                                <span>ID: {item.service_id}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Td>
                      <Td className="text-gray-700 font-mono">
                        SAR {cost.toFixed(2)}
                      </Td>
                      <Td className="text-gray-700 font-mono">
                        SAR {price.toFixed(2)}
                      </Td>
                      <Td>
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-medium">
                          {quantity}
                        </div>
                      </Td>
                      <Td className="font-medium text-green-600 font-mono">
                        SAR {total.toFixed(2)}
                      </Td>
                      <Td>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isStandardService
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          {isStandardService ? "Service" : "Custom"}
                        </div>
                      </Td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <Td colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiPackage size={24} className="text-gray-400" />
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        No Appointment Items Found
                      </p>
                      <p className="text-gray-400">
                        There are no appointment items available yet
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        {!isLoading && !error && data?.data?.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">{data.data.length}</span> items
                {data.results && data.results > data.data.length && (
                  <span>
                    {" "}
                    of <span className="font-semibold">
                      {data.results}
                    </span>{" "}
                    total
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Standard:{" "}
                    <span className="font-semibold">
                      {data.data.filter((item: any) => item.service_id).length}
                    </span>
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Custom:{" "}
                    <span className="font-semibold">
                      {data.data.filter((item: any) => !item.service_id).length}
                    </span>
                  </span>
                </div>
                <div className="hidden md:block text-sm text-gray-600">
                  <span className="font-semibold">
                    SAR{" "}
                    {data.data
                      .reduce((sum: number, item: any) => {
                        const price = parseFloat(
                          item.custom_price || item.service?.price || 0
                        );
                        const quantity = item.quantity || 1;
                        return sum + price * quantity;
                      }, 0)
                      .toFixed(2)}
                  </span>{" "}
                  total value
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Main Component with Tabs
const AppointmentsItems = () => {
  const [activeTab, setActiveTab] = useState<"appointments" | "add" | "manage">(
    "appointments"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Appointment Services
          </h1>
          <p className="text-gray-600 mt-1">
            Manage appointment services and items
          </p>
        </div>

        {/* Quick Actions */}
    
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "appointments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <FiPackage className="mr-2" />
              Services
            </div>
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "add"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <FiPlus className="mr-2" />
              Management Services
            </div>
          </button>

        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "appointments" ? (
          <AppointmentsItemsTab />
        ) : activeTab === "add" ? (
          <Services />
        ) : null}
      </div>
    </div>
  );
};

export default AppointmentsItems;
