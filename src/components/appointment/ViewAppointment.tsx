import { Link } from "react-router-dom";
import type { IAppointment } from "./types";

const Field = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-medium text-gray-900">
        {value !== null && value !== undefined && value !== "" ? value : "—"}
      </span>
    </div>
  );
};

const ViewAppointment = ({
  appointment,
  requestId,
}: {
  appointment: IAppointment;
  requestId?: string;
}) => {
  console.log("appointment", appointment);
  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Appointment Details</h2>

        {/* زر التعديل */}
        <Link
          to={`/admins/consultation_requests/appointments/edit/${appointment?.id}/${requestId}`}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-blue-600 hover:bg-blue-50 transition"
        >
          ✏️ Edit
        </Link>
      </div>

      {/* Grid 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* العمود الأول */}
        <div>
          <Field label="Order Number#" value={appointment?.id} />
          <Field label="National #" value={appointment?.nationality} />
          <Field label="Age" value={appointment?.age} />
          <Field
            label="Date of Birth"
            value={appointment?.date_of_birth}
          />
          <Field
            label="Refund Slip"
            value={appointment?.payment_details?.refund_slip}
          />
          <Field
            label="Arrival Time"
            value={appointment?.payment_details?.arrival_time}
          />
          <Field label="Payment Date" value={appointment?.payment_Date} />
          <Field
            label="Discount"
            value={appointment?.payment_details?.discount}
          />
          <Field
            label="Transaction Status"
            value={appointment?.payment_details?.transaction_status}
          />
        </div>

        {/* العمود الثاني */}
        <div>
          <Field
            label="Nationality"
            value={appointment?.nationality}
          />
          <Field label="Gender" value={appointment?.gender} />
          {/* <Field
            label="Customer Service Date"
            value={appointment?.service_date}
          />
          <Field
            label="Service Time"
            value={appointment?.service_time}
          /> */}
          <Field
            label="Bank Transfer Document"
            value={appointment?.payment_details?.bank_transfer_doc}
          />
          <Field
            label="Payment Method"
            value={appointment?.payment_details?.method}
          />
          <Field label="Items" value={appointment?.appointment_items.length} />
          {/* <Field
            label="Latitude"
            value={appointment?.latitude}
          /> */}
        </div>

        {/* العمود الثالث */}
        <div>
          <Field
            label="Service Provider Cost"
            value={appointment?.service_provider_cost}
          />
          <Field
            label="Service Price"
            value={appointment?.service_provider_cost}
          />
          <Field
            label="Service Provider Cost (VAT)"
            value={appointment?.vendor_percentage}
          />
          <Field
            label="Service Price (VAT)"
            value={appointment?.app_percentage}
          />
          <Field
            label="Location Link"
            value={appointment?.location_link}
          />
          <Field
            label="Service Provider Name"
            value={appointment?.provider_name}
          />
          <Field
            label="Payment Link"
            value={appointment?.payment_link}
          />
          <Field
            label="Longitude"
            value={appointment?.longitude}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewAppointment;
