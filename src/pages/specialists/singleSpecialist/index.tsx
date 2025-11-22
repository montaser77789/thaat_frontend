import React from "react";
import { useParams } from "react-router-dom";
import { useGetSpecialistsByIdQuery } from "../../../app/Api/Slices/specialistApiSlice";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiGlobe, 
  FiNavigation,
  FiBriefcase,
  FiFileText,
  FiImage,
  FiDownload,
  FiEye
} from "react-icons/fi";
import Button from "../../../components/ui/Button";
import { Link } from "react-router-dom";

// أنواع البيانات
type Specialist = {
  id: number;
  name: string;
  title: string;
  id_Number: string;
  date_of_birth: string;
  gender: string;
  tracking_link: string;
  mobile: string;
  nationality: string;
  email: string;
  Latitude: number;
  Longitude: number;
  description: string;
  description_locale: string;
  logo_url: string | null;
  id_document: string | null;
  city_id: number;
  medical_branch_id: number;
  created_at: string;
  updated_at: string;
  city: {
    id: number;
    name: string;
  };
  medical_branch: {
    id: number;
    name: string;
    name_locale: string;
    partner?: {
      id: number;
      name: string;
    };
  };
};

const SingleSpecialist = () => {
  const { id } = useParams();
  const { data: specialistResponse, isLoading, error } = useGetSpecialistsByIdQuery(id);
  
  const specialist: Specialist | undefined = specialistResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading specialist details...</p>
        </div>
      </div>
    );
  }

  if (error || !specialist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Specialist Not Found</h2>
          <p className="text-gray-600 mb-4">The specialist you're looking for doesn't exist.</p>
          <Link to="/specialists">
            <Button>Back to Specialists</Button>
          </Link>
        </div>
      </div>
    );
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // إنشاء رابط خرائط جوجل
  const getGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  // عرض الملفات
  const renderFile = (fileUrl: string | null, label: string, type: 'image' | 'document') => {
    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="text-center">
            <FiFileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No {label} uploaded</p>
          </div>
        </div>
      );
    }

    const fullFileUrl = `${import.meta.env.VITE_PUBLIC_API_URL}/${fileUrl}`;

    if (type === 'image') {
      return (
        <div className="space-y-3">
          <div className="border rounded-lg overflow-hidden">
            <img 
              src={fullFileUrl} 
              alt={label}
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fullFileUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <FiEye className="h-4 w-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = fullFileUrl;
                link.download = `${label.toLowerCase().replace(' ', '_')}.${fileUrl.split('.').pop()}`;
                link.click();
              }}
              className="flex items-center gap-2"
            >
              <FiDownload className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      );
    }

    // للمستندات
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <FiFileText className="h-12 w-12 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(fullFileUrl, '_blank')}
            className="flex items-center gap-2"
          >
            <FiEye className="h-4 w-4" />
            View Document
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const link = document.createElement('a');
              link.href = fullFileUrl;
              link.download = `${label.toLowerCase().replace(' ', '_')}.${fileUrl.split('.').pop()}`;
              link.click();
            }}
            className="flex items-center gap-2"
          >
            <FiDownload className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Specialist Details</h1>
              <p className="text-gray-600 mt-2">View complete information about the specialist</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link to="/specialists">
                <Button variant="outline">Back to List</Button>
              </Link>
              <Link to={`/admins/specialists/${id}/edit`}>
                <Button>Edit Specialist</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأيسر - المعلومات الأساسية */}
          <div className="lg:col-span-2 space-y-6">
            {/* البطاقة الشخصية */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start space-x-6">
                {/* الصورة الشخصية */}
                <div className="flex-shrink-0">
                  {specialist.logo_url ? (
                    <img
                      src={`${import.meta.env.VITE_PUBLIC_API_URL}/${specialist.logo_url}`}
                      alt={specialist.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center">
                      <FiUser className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* المعلومات الأساسية */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{specialist.name}</h2>
                  <p className="text-lg text-blue-600 font-semibold mb-4">{specialist.title}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FiMail className="h-5 w-5 text-blue-500" />
                      <span>{specialist.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FiPhone className="h-5 w-5 text-green-500" />
                      <span>{specialist.mobile}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FiUser className="h-5 w-5 text-purple-500" />
                      <span className="capitalize">{specialist.gender}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FiGlobe className="h-5 w-5 text-orange-500" />
                      <span>{specialist.nationality}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* المعلومات المهنية */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiBriefcase className="text-blue-600" />
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                    <p className="text-gray-900 font-mono">{specialist.id_Number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Branch</label>
                    <p className="text-gray-900">{specialist.medical_branch.name}</p>
                    {specialist.medical_branch.partner && (
                      <p className="text-sm text-gray-500 mt-1">
                        Partner: {specialist.medical_branch.partner.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-gray-900">{specialist.city.name}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-gray-900">{formatDate(specialist.date_of_birth)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Link</label>
                    <a 
                      href={specialist.tracking_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all"
                    >
                      {specialist.tracking_link}
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <a
                      href={getGoogleMapsLink(specialist.Latitude, specialist.Longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                      <FiMapPin className="h-4 w-4" />
                      View on Google Maps
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      {specialist.Latitude}, {specialist.Longitude}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* الوصف */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English Description</label>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-gray-700 whitespace-pre-wrap">{specialist.description}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arabic Description</label>
                  <div className="p-4 bg-gray-50 rounded-lg border" dir="rtl">
                    <p className="text-gray-700 whitespace-pre-wrap">{specialist.description_locale}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الأيمن - الملفات والمعلومات الإضافية */}
          <div className="space-y-6">
            {/* الملفات */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                Files & Documents
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Profile Logo</label>
                  {renderFile(specialist.logo_url, "Profile Logo", "image")}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">ID Document</label>
                  {renderFile(specialist.id_document, "ID Document", "document")}
                </div>
              </div>
            </div>

            {/* المعلومات الإضافية */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Specialist ID</span>
                  <span className="font-mono text-gray-900">#{specialist.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Created At</span>
                  <span className="text-gray-900">{formatDate(specialist.created_at)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900">{formatDate(specialist.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* الإحصائيات */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{specialist.consultationRequests?.length || 0}</div>
                  <div className="text-sm text-gray-600">Consultation Requests</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{specialist.members?.length || 0}</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{specialist.appointments?.length || 0}</div>
                  <div className="text-sm text-gray-600">Appointments</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleSpecialist;