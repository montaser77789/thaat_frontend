import { Link, useSearchParams } from "react-router-dom";
import { useGetPartenersQuery } from "../../app/Api/Slices/partenersApiSlice";
import {
  customStyles,
  type Branch,
  type OptionType,
  type Partner,
} from "../../types";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useDeleteTeamMutation,
  useGetTeamsQuery,
} from "../../app/Api/Slices/teamsApiSlice";
import Button from "../../components/ui/Button";
import { FaEdit, FaEye, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import { useGerBranchByPartnerQuery } from "../../app/Api/Slices/BranchesApiSlice";
import { Td, Th } from "../../components/ui/Tables";
import { formatDate } from "../../utils/formatDate";
import { PaginationControls } from "../../components/ui/PaginationControls";
import { useGetCityQuery } from "../../app/Api/Slices/CityApiSlice";

const TeamsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // جلب معاملات البحث من URL
  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlPartnerId = searchParams.get("partner_id") || "";
  const urlBranchId = searchParams.get("medical_branch_id") || "";
  const urlCityId = searchParams.get("city_id") || "";
  const urlStatus = searchParams.get("status") || "";

  // حالة محلية للبحث
  const [searchTerm, setSearchTerm] = useState<string>(urlSearch);
  const [selectedPartnerId, setSelectedPartnerId] =
    useState<string>(urlPartnerId);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(urlBranchId);
  const [selectedCityId, setSelectedCityId] = useState<string>(urlCityId);
  const [selectedStatus, setSelectedStatus] = useState<string>(urlStatus);

  // API Calls
  const [deleteTeam] = useDeleteTeamMutation();

  const {
    data: teamsResponse,
    isLoading,
    error,
  } = useGetTeamsQuery({
    page,
    limit: perPage,
    search: urlSearch || undefined,
    partner_id: urlPartnerId || undefined,
    medical_branch_id: urlBranchId || undefined,
    city_id: urlCityId || undefined,
    status: urlStatus || undefined,
  });

  const { data: partnersData } = useGetPartenersQuery({
    limit: 100,
    page: 1,
  });

  const { data: citiesData } = useGetCityQuery({});

  // جلب الـ branches بناءً على الـ partner المختار
  const { data: branchesData, isLoading: branchesLoading } =
    useGerBranchByPartnerQuery(
      selectedPartnerId ? Number(selectedPartnerId) : 0,
      { skip: !selectedPartnerId }
    );

  // البيانات
  const teams = teamsResponse?.data || [];
  const partners: Partner[] = partnersData?.data || [];
  const cities = citiesData?.data || [];
  const branches: Branch[] = branchesData?.data || [];

  const pagination = teamsResponse || {
    total: 0,
    page: 1,
    limit: perPage,
  };

  // تحويل البيانات إلى options للـ Select
  const partnerOptions: OptionType[] = partners.map((p) => ({
    value: String(p.id),
    label: p.name,
    logo: p.logo_url ?? null,
  }));

  const branchOptions: OptionType[] = branches.map((branch) => ({
    value: String(branch.id),
    label: branch.name,
  }));

  const cityOptions: OptionType[] = cities.map((city: any) => ({
    value: String(city.id),
    label: city.name,
  }));

  const statusOptions: OptionType[] = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  // تحديث URL مع الفلاتر
  const updateFilters = (updates: {
    search?: string;
    partner_id?: string;
    medical_branch_id?: string;
    city_id?: string;
    status?: string;
    page?: number;
  }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      // تحديث أو حذف المعلمات
      const updatesMap = {
        search: updates.search,
        partner_id: updates.partner_id,
        medical_branch_id: updates.medical_branch_id,
        city_id: updates.city_id,
        status: updates.status,
      };

      Object.entries(updatesMap).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }
        }
      });

      // تحديث الصفحة
      params.set("page", String(updates.page || page));
      params.set("per_page", String(perPage));

      return params;
    });
  };

  // معالجة البحث
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value, page: 1 });
  };

  // معالجة تغيير الـ Partner
  const handlePartnerChange = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setSelectedBranchId(""); // إعادة تعيين الفرع عند تغيير الـ Partner
    updateFilters({
      partner_id: partnerId,
      medical_branch_id: "",
      page: 1,
    });
  };

  // معالجة تغيير الـ Branch
  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    updateFilters({ medical_branch_id: branchId, page: 1 });
  };

  // معالجة تغيير المدينة
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    updateFilters({ city_id: cityId, page: 1 });
  };

  // معالجة تغيير الحالة
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateFilters({ status, page: 1 });
  };

  // إعادة تعيين الفلاتر
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedPartnerId("");
    setSelectedBranchId("");
    setSelectedCityId("");
    setSelectedStatus("");

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("search");
      params.delete("partner_id");
      params.delete("medical_branch_id");
      params.delete("city_id");
      params.delete("status");
      params.set("page", "1");
      return params;
    });
  };

  // Close modal
  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedTeam(null);
  };

  // Delete Team
  const deleteTeamHandler = async (id: number) => {
    try {
      const result = await deleteTeam(id).unwrap();
      toast.success(`${result?.message}`);
      closeModal();
    } catch (error) {
      console.error("Error Deleting Team:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const confirmDelete = (team: any) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
  };

  const filtersApplied =
    searchTerm ||
    selectedPartnerId ||
    selectedBranchId ||
    selectedCityId ||
    selectedStatus;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teams Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your business teams and their details
          </p>
        </div>
        <Link to="/admins/teams/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-md">
            <FaPlus className="mr-2" />
            Add New Team
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="absolute inset-y-0 top-3 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Select<OptionType>
              options={cityOptions}
              value={
                cityOptions.find((opt) => opt.value === selectedCityId) || null
              }
              onChange={(opt) => handleCityChange(opt?.value || "")}
              placeholder="Select City"
              isClearable
              styles={customStyles}
            />
          </div>

          {/* Partner Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner
            </label>
            <Select<OptionType>
              options={partnerOptions}
              value={
                partnerOptions.find((opt) => opt.value === selectedPartnerId) ||
                null
              }
              onChange={(opt) => handlePartnerChange(opt?.value || "")}
              placeholder="Select Partner"
              isClearable
              components={{ Option, SingleValue }}
              styles={customStyles}
            />
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <Select<OptionType>
              options={branchOptions}
              value={
                branchOptions.find((opt) => opt.value === selectedBranchId) ||
                null
              }
              onChange={(opt) => handleBranchChange(opt?.value || "")}
              placeholder={
                !selectedPartnerId ? "Select partner first" : "Select Branch"
              }
              isClearable
              isDisabled={!selectedPartnerId}
              isLoading={branchesLoading}
              styles={customStyles}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select<OptionType>
              options={statusOptions}
              value={
                statusOptions.find((opt) => opt.value === selectedStatus) ||
                null
              }
              onChange={(opt) => handleStatusChange(opt?.value || "")}
              placeholder="Select Status"
              isClearable
              styles={customStyles}
            />
          </div>

          {/* Reset Filters Button */}
          <div className="flex items-end">
            {filtersApplied && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all w-full"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {filtersApplied && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => handleSearchChange("")}
                  className="ml-2 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCityId && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                City:{" "}
                {cityOptions.find((c) => c.value === selectedCityId)?.label}
                <button
                  onClick={() => handleCityChange("")}
                  className="ml-2 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedPartnerId && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Partner:{" "}
                {
                  partnerOptions.find((p) => p.value === selectedPartnerId)
                    ?.label
                }
                <button
                  onClick={() => handlePartnerChange("")}
                  className="ml-2 hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedBranchId && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                Branch:{" "}
                {branchOptions.find((b) => b.value === selectedBranchId)?.label}
                <button
                  onClick={() => handleBranchChange("")}
                  className="ml-2 hover:text-orange-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                Status:{" "}
                {statusOptions.find((s) => s.value === selectedStatus)?.label}
                <button
                  onClick={() => handleStatusChange("")}
                  className="ml-2 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Arabic Name</Th>
                <Th>City</Th>
                <Th>Branch</Th>
                <Th>Partner</Th>
                <Th>Status</Th>
                <Th>Members</Th>
                <Th>Created At</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={10} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading Teams...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={10} className="text-center py-8 text-red-500">
                    Error loading teams
                  </Td>
                </tr>
              ) : teams.length > 0 ? (
                teams.map((team: any) => (
                  <tr
                    key={team.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{team.id}</Td>
                    <Td className="font-medium text-gray-900">{team.name}</Td>
                    <Td className="text-gray-700">{team.name_ar}</Td>
                    <Td>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {team.city?.name}
                      </span>
                    </Td>
                    <Td className="text-gray-600">
                      {team.medical_branch?.name}
                    </Td>
                    <Td className="text-gray-600">
                      {team.medical_branch?.partner?.name}
                    </Td>
                    <Td>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          team.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {team.status}
                      </span>
                    </Td>
                    <Td className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        {team.members?.length || 0}
                      </span>
                    </Td>
                    <Td className="text-sm text-gray-500">
                      {formatDate(team.created_at)}
                    </Td>
                    <Td>
                      <div className="flex justify-center space-x-2">
                        <Link to={`/admins/teams/${team.id}`}>
                          <Button title="View" size={"icon"} variant={"ghost"}>
                            <FaEye />
                          </Button>
                        </Link>
                        <Link to={`/admins/teams/${team.id}/edit`}>
                          <Button title="Edit" variant={"ghost"} size={"icon"}>
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => confirmDelete(team)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={10} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">👥</div>
                      <p className="text-lg font-semibold">No Teams Found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {filtersApplied
                          ? "Try changing your search or filters"
                          : "No teams available yet"}
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        {!isLoading && !error && teams.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing <span className="font-medium">{teams.length}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> teams
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={Math.ceil(pagination.total / perPage)}
              perPage={perPage}
              onPageChange={(newPage, newPerPage) => {
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.set("page", String(newPage));
                  params.set("per_page", String(newPerPage));
                  if (urlSearch) params.set("search", urlSearch);
                  if (urlPartnerId) params.set("partner_id", urlPartnerId);
                  if (urlBranchId) params.set("medical_branch_id", urlBranchId);
                  if (urlCityId) params.set("city_id", urlCityId);
                  if (urlStatus) params.set("status", urlStatus);
                  return params;
                });
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Team
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete team "{selectedTeam.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteTeamHandler(selectedTeam.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// مكونات الـ Select المخصصة
const Option = (props: OptionProps<OptionType>) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {data.logo ? (
          <img
            src={data.logo}
            alt={data.label}
            style={{
              width: 36,
              height: 36,
              objectFit: "cover",
              borderRadius: 6,
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://via.placeholder.com/36?text=No+Img";
            }}
          />
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              background: "#eee",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            N/A
          </div>
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{data.label}</div>
        </div>
      </div>
    </components.Option>
  );
};

const SingleValue = (props: SingleValueProps<OptionType>) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {data.logo ? (
          <img
            src={data.logo}
            alt={data.label}
            style={{
              width: 28,
              height: 28,
              objectFit: "cover",
              borderRadius: 6,
            }}
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).src =
                "https://via.placeholder.com/28?text=No")
            }
          />
        ) : null}
        <span>{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

export default TeamsPage;
