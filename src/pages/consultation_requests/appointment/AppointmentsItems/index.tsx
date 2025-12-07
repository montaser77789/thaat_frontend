import React from "react";
import { useGetappointmentItemServiceQuery } from "../../../../app/Api/Slices/appointmentApiSlice";
import { Td, Th } from "../../../../components/ui/Tables";

const AppointmentsItems = () => {
  const { data, isLoading, error } = useGetappointmentItemServiceQuery({});
  
  console.log("data", data);

  return (
    <div>
      {/* Appointment Items Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                <Th>ID</Th>
                <Th>Appointment ID</Th>
                <Th>Service Name</Th>
                <Th>Custom Name</Th>
                <Th>Cost</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
                <Th>Total</Th>
                <Th>Type</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={9} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading appointment items...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={9} className="text-center py-8 text-red-500">
                    Error loading appointment items
                  </Td>
                </tr>
              ) : data?.data?.length > 0 ? (
                data.data.map((item: any) => {
                  // حساب الإجمالي
                  const cost = item.custom_cost || item.service?.cost || 0;
                  const price = item.custom_price || item.service?.price || 0;
                  const quantity = item.quantity || 1;
                  const total = price * quantity;
                  
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Td className="font-medium text-gray-900">#{item.id}</Td>
                      <Td className="font-medium text-gray-900">
                        #{item.appointment_id}
                      </Td>
                      <Td className="text-gray-700">
                        {item.service ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{item.service.name}</span>
                            <span className="text-xs text-gray-500">Code: {item.service.code}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </Td>
                      <Td className="text-gray-700">
                        {item.custom_name || (
                          <span className="text-gray-400">-</span>
                        )}
                      </Td>
                      <Td className="text-gray-700">${parseFloat(cost).toFixed(2)}</Td>
                      <Td className="text-gray-700">${parseFloat(price).toFixed(2)}</Td>
                      <Td className="text-gray-700">{quantity}</Td>
                      <Td className="font-medium text-green-600">
                        ${total.toFixed(2)}
                      </Td>
                      <Td>
                        {item.service_id ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Standard Service
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Custom Service
                          </span>
                        )}
                      </Td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <Td colSpan={9} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-lg font-semibold">No Appointment Items Found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        No appointment items available yet
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {!isLoading && !error && data?.data?.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{data.data.length}</span>{" "}
              of <span className="font-medium">{data.results || data.data.length}</span>{" "}
              appointment items
            </div>
            
            {/* Optional: إضافة إحصائيات إضافية */}
            {data.data.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>
                    Standard Services:{" "}
                    <span className="font-medium">
                      {data.data.filter((item: any) => item.service_id).length}
                    </span>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span>
                    Custom Services:{" "}
                    <span className="font-medium">
                      {data.data.filter((item: any) => !item.service_id).length}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsItems;