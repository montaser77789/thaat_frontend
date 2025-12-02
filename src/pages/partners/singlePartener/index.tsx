import { useParams, Link } from "react-router-dom";
import { useGetPartenerByIdQuery } from "../../../app/Api/Slices/partenersApiSlice";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiXCircle,
  FiGlobe,
  FiHome,
  FiBriefcase,
  FiDownload,
  FiEdit,
} from "react-icons/fi";
import Button from "../../../components/ui/Button";

const SinglePartener = () => {
  const params = useParams();
  const {
    data: partnerResponse,
    isLoading,
    error,
  } = useGetPartenerByIdQuery(params.id);

  console.log(partnerResponse);

  const partner = partnerResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading partner details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiXCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Partner
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load partner details. Please try again.
          </p>
          <Link to="/admins/partners">
            <Button variant="outline" icon={<FiArrowLeft />}>
              Back to Partners
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Partner Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested partner could not be found.
          </p>
          <Link to="/admins/partners">
            <Button variant="outline" icon={<FiArrowLeft />}>
              Back to Partners
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // دالة لتحميل الملفات
  const handleDownload = (url: string, filename: string) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    }
  };

  // دالة مبسطة لعرض حالة المستند
  const renderDocumentStatus = (url: string, label: string) => {
    // تحسين التحقق من صحة الرابط
    const isValidUrl =
      url &&
      typeof url === "string" &&
      url.trim() !== "" &&
      !url.includes("undefined") &&
      !url.includes("null") &&
      url.startsWith("http");

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {isValidUrl ? (
          <button
            onClick={() => {
              // استخراج اسم الملف من الرابط أو استخدام اسم افتراضي
              const fileName =
                url.split("/").pop() ||
                `${label.toLowerCase().replace(" ", "_")}.pdf`;
              handleDownload(url, fileName);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <FiDownload className="h-4 w-4" />
            Download
          </button>
        ) : (
          <span className="text-sm text-gray-500">Not uploaded</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admins/partners">
              <Button variant="ghost" size="icon">
                <FiArrowLeft />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Partner Details
              </h1>
              <p className="text-gray-600">
                View and manage partner information
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الأيسر - المعلومات الأساسية */}
        <div className="lg:col-span-2 space-y-6">
          {/* بطاقة المعلومات الأساسية */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiBriefcase className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {partner.name}
                </h2>
                <p className="text-gray-600 text-right" dir="rtl">
                  {partner.name_locale}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      partner.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-1 ${
                        partner.status === "ACTIVE"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {partner.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                  {partner.branches_count !== undefined && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {partner.branches_count} Branches
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiUser className="text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contact Person
                    </label>
                    <p className="text-gray-900 font-medium">
                      {partner.contact_person_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 font-medium flex items-center gap-2">
                      <FiMail className="h-4 w-4 text-gray-400" />
                      {partner.contact_person_email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <p className="text-gray-900 font-medium flex items-center gap-2">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      {partner.contact_person_number}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiMapPin className="text-blue-600" />
                  Location Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Country
                    </label>
                    <p className="text-gray-900 font-medium flex items-center gap-2">
                      <FiGlobe className="h-4 w-4 text-gray-400" />
                      {partner.country?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      City
                    </label>
                    <p className="text-gray-900 font-medium flex items-center gap-2">
                      <FiMapPin className="h-4 w-4 text-gray-400" />
                      {partner.city?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Address
                    </label>
                    <p className="text-gray-900 font-medium flex items-center gap-2">
                      <FiHome className="h-4 w-4 text-gray-400" />
                      {partner.address}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Location
                    </label>
                    <p className="text-gray-900 font-medium">
                      {partner.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بطاقة المعلومات التجارية */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  CR Number
                </label>
                <p className="text-gray-900 font-medium">{partner.cr_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  VAT Number
                </label>
                <p className="text-gray-900 font-medium">
                  {partner.vat_number || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  MOH Number
                </label>
                <p className="text-gray-900 font-medium">
                  {partner.moh_number || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الأيمن - المستندات والإجراءات */}
        <div className="space-y-6">
          {/* بطاقة المستندات */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Documents
            </h3>
            <div className="space-y-3">
              {renderDocumentStatus(partner.logo_url, "Company Logo")}
              {renderDocumentStatus(partner.cr_document_url, "CR Document")}
              {renderDocumentStatus(partner.vat_document_url, "VAT Document")}
              {renderDocumentStatus(partner.moh_document_url, "MOH Document")}
              {renderDocumentStatus(
                partner.agreement_document_url,
                "Agreement Document"
              )}
              {renderDocumentStatus(
                partner.other_document_url,
                "Other Documents"
              )}
            </div>
          </div>

          {/* بطاقة الإجراءات السريعة */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3 ">
              <Link to={`/admins/partners/${partner.id}/edit`}>
                <Button variant="outline" fullWidth icon={<FiEdit />}>
                  Edit Partner
                </Button>
              </Link>

              <Button variant="outline" fullWidth icon={<FiUser />}>
                Contact Partner
              </Button>
            </div>
          </div>

          {/* بطاقة معلومات النظام */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Partner ID
                </label>
                <p className="text-gray-900 font-medium">#{partner.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p
                  className={`font-medium ${
                    partner.status === "ACTIVE"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {partner.status === "ACTIVE" ? "Active" : "Inactive"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created
                </label>
                <p className="text-gray-900 font-medium">N/A</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Updated
                </label>
                <p className="text-gray-900 font-medium">N/A</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePartener;
