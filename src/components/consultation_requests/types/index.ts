export type PatientStatus =
  | "Select Status"
  | "New Order"
  | "Under Revision"
  | "Dispatch To Service Provider"
  | "Order Confirmed"
  | "Invoice Sent"
  | "Payment Completed"
  | "Medical Team On The Way"
  | "Medical Team Arrived"
  | "Service Completed and Service Rating"
  | "Follow Up Services"
  | "Scheduling Additional Services"
  | "Cancelled"
  | "Refunded"
  | "Cancelled By Thaat"

export type TransactionStatus =
  | "Successful"
  | "Pending"
  | "Cancelled"
  | "Refunded"
  | "-";

export type  ActionOption =
  | "View Details"
  | "Duplicate"
  | "Location Link"
  | "Send to SP"
  | "Child Appointment"
  | "Send to Teams";
