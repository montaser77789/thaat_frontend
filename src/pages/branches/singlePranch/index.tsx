
import { useParams } from 'react-router-dom';
import { useGetBranchByIdQuery } from '../../../app/Api/Slices/BranchesApiSlice';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaBuilding, FaClock, FaCity, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


type WorkingHours = {
  id: number;
  medical_branch_id: number;
  day: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

type Service = {
  id: number;
  name: string;
  cost?: string;
  price?: string;
};

type BranchService = {
  id: number;
  medical_branch_id: number;
  service_id: number;
  service: Service;
};

type Branch = {
  id: number;
  name: string;
  name_locale: string;
  contact_person_name: string;
  contact_person_number: string;
  contact_person_email: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  status: string;
  partner_id: number;
  city_id: number;
  created_at: string;
  updated_at: string;
  partner: {
    id: number;
    name: string;
    name_locale: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_number: string;
    logo_url?: string;
  };
  city: {
    id: number;
    name: string;
  };
  working_hours_per_day: WorkingHours[];
  branchServices: BranchService[];
  latitude?: number;
  longitude?: number;
  business_type?: number;
  business_class?: number;
  allow_change_in_days?: number;
  allow_cancel_in_days?: number;
  percentage?: number;
};

export default function SingleBranch() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetBranchByIdQuery(id);
  
  const branch: Branch | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading branch details...</p>
        </div>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Branch Not Found</h2>
          <p className="text-gray-600">The requested branch could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {branch.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <FaBuilding className="mr-2 text-blue-600" />
                  <span>Branch ID: #{branch.id}</span>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  branch.status === "ACTIVE" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {branch.status === "ACTIVE" ? (
                    <FaCheckCircle className="mr-1" />
                  ) : (
                    <FaTimesCircle className="mr-1" />
                  )}
                  {branch.status === "ACTIVE" ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-gray-700 font-medium">
                {new Date(branch.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="text-gray-900 font-medium">{branch.contact_person_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center text-gray-900">
                      <FaEnvelope className="mr-2 text-blue-600" />
                      {branch.contact_person_email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <div className="flex items-center text-gray-900">
                      <FaPhone className="mr-2 text-blue-600" />
                      {branch.phone}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile</label>
                    <p className="text-gray-900">{branch.mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Branch Email</label>
                    <p className="text-gray-900">{branch.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Location Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{branch.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">City</label>
                  <div className="flex items-center text-gray-900">
                    <FaCity className="mr-2 text-green-600" />
                    {branch.city?.name}
                  </div>
                </div>
                {branch.latitude && branch.longitude && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Coordinates</label>
                    <p className="text-gray-900">
                      Lat: {branch.latitude}, Lng: {branch.longitude}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Working Hours Card */}
            {branch.working_hours_per_day && branch.working_hours_per_day.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaClock className="mr-2 text-orange-600" />
                  Working Hours
                </h2>
                <div className="space-y-3">
                  {branch.working_hours_per_day.map((schedule: WorkingHours) => (
                    <div key={schedule.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900 capitalize">{schedule.day}</span>
                      <span className="text-gray-700">
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Side Information */}
          <div className="space-y-6">
            
            {/* Partner Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaBuilding className="mr-2 text-purple-600" />
                Partner Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Partner Name</label>
                  <p className="text-gray-900 font-medium">{branch.partner?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Partner Email</label>
                  <p className="text-gray-900">{branch.partner?.contact_person_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Partner Phone</label>
                  <p className="text-gray-900">{branch.partner?.contact_person_number}</p>
                </div>
                {branch.partner?.logo_url && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Partner Logo</label>
                    <div className="mt-2">
                      <img 
                        src={branch.partner.logo_url} 
                        alt="Partner Logo"
                        className="h-16 w-16 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Logo';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-gray-600" />
                Additional Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Type</label>
                  <p className="text-gray-900">{branch.business_type || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Class</label>
                  <p className="text-gray-900">{branch.business_class || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Allow Change (Days)</label>
                  <p className="text-gray-900">{branch.allow_change_in_days} days</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Allow Cancel (Days)</label>
                  <p className="text-gray-900">{branch.allow_cancel_in_days} days</p>
                </div>
                {branch.percentage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Percentage</label>
                    <p className="text-gray-900">{branch.percentage}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* Services Card */}
            {branch.branchServices && branch.branchServices.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
                <div className="space-y-2">
                  {branch.branchServices.map((service: BranchService) => (
                    <div key={service.id} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-blue-800 font-medium">{service.service?.name}</span>
                      {service.service?.price && (
                        <span className="text-green-600 font-bold">{service.service.price}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {new Date(branch.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}