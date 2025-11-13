export type PatientStatus =
  | "New Order"
  | "Under Revision"
  | "Dispatch To Service Provider"
  | "Order Confirmed"
  | "Invoice Sent"
  | "Payment Completed"
  | "Medical Team On The Way";

export type TransactionStatus = "Successful" | "Pending" | "Failed" | "-";


export type ActionOption =
  | "View Details"
  | "Duplicate"
  | "Location Link"
  | "Send to SP"
  | "Child Appointment"
  | "Send to Teams";

