import { toast } from "react-toastify";

// دالة موحدة لمعالجة الأخطاء
export const handleApiError = (error: any, operation: "create" | "update") => {
  const operationText = operation === "create" ? "create" : "update";

  if (error.data?.message) {
    toast.error(`Failed to ${operationText} partner: ${error.data.message}`);
  } else if (error.status === 400) {
    toast.error("Validation error: Please check your input data");
  } else if (error.status === 409) {
    toast.error("Partner already exists with this email or CR number");
  } else if (error.status === 404) {
    toast.error("Partner not found");
  } else if (error.status === 500) {
    toast.error("Server error: Please try again later");
  } else {
    toast.error(`Failed to ${operationText} partner. Please try again.`);
  }
};
