import { useEffect, useState } from "react";
import {
  useDeleteSpecialistMutation,
  useGetSpecialistsQuery,
} from "../../app/Api/Slices/specialistApiSlice";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Modal from "../../components/ui/Modal";
import { toast } from "react-toastify";
import { useGetPartenersQuery } from "../../app/Api/Slices/partenersApiSlice";
import {
  customStyles,
  type Branch,
  type OptionType,
  type Partner,
} from "../../types";
import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import { useGerBranchByPartnerQuery } from "../../app/Api/Slices/BranchesApiSlice";
import { PaginationControls } from "../../components/ui/PaginationControls";
import { Td, Th } from "../../components/ui/Tables";
import { formatDate } from "../../utils/formatDate";

// أنواع البيانات
type Specialist = {
  id: number;
  name: string;
  email: string;
  title: string;
  mobile: string;
  gender: string;
  status: string;
  logo_url?: string;
  partner?: {
    id: number;
    name: string;
  };
  medical_branch?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
  };
  created_at: string;
};

const SpecialistsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // جلب معاملات البحث من URL
  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlPartnerId = searchParams.get("partner_id") || "";
  const urlBranchId = searchParams.get("branch_id") || "";

  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [selectedPartnerId, setSelectedPartnerId] =
    useState<string>(urlPartnerId);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(urlBranchId);

  const [deleteSpecialist] = useDeleteSpecialistMutation();

  // جلب البيانات
  const { data: partnersData } = useGetPartenersQuery({
    limit: 100,
    page: 1,
  });

  const {
    data: specialistsResponse,
    isLoading,
    error,
  } = useGetSpecialistsQuery({
    page,
    limit: perPage,
    search: debouncedSearch || undefined,
    partner_id: selectedPartnerId || undefined,
    medical_branch_id: selectedBranchId || undefined,
  });

  // جلب الـ branches بناءً على الـ partner المختار
  const { data: branchesData, isLoading: branchesLoading } =
    useGerBranchByPartnerQuery(
      selectedPartnerId ? Number(selectedPartnerId) : 0,
      { skip: !selectedPartnerId }
    );

  const partners: Partner[] = partnersData?.data || [];
  const branches: Branch[] = branchesData?.data || [];

  // البيانات من الـ API
  const specialists = specialistsResponse?.data || [];
  const pagination = specialistsResponse?.pagination || {
    total: 0,
    totalPages: 1,
    currentPage: page,
    perPage,
  };

  // Debounce للبحث
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // مزامنة الـ state مع الـ URL
  useEffect(() => {
    setSearchTerm(urlSearch);
    setSelectedPartnerId(urlPartnerId);
    setSelectedBranchId(urlBranchId);
  }, [urlSearch, urlPartnerId, urlBranchId]);

  // تحديث URL مع الفلاتر
  const updateURL = (updates: {
    search?: string;
    partner_id?: string;
    branch_id?: string;
    page?: number;
  }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (updates.search !== undefined) {
        if (updates.search) {
          params.set("search", updates.search);
        } else {
          params.delete("search");
        }
      }

      if (updates.partner_id !== undefined) {
        if (updates.partner_id) {
          params.set("partner_id", updates.partner_id);
        } else {
          params.delete("partner_id");
        }
      }

      if (updates.branch_id !== undefined) {
        if (updates.branch_id) {
          params.set("branch_id", updates.branch_id);
        } else {
          params.delete("branch_id");
        }
      }

      params.set("page", String(updates.page || page));
      params.set("per_page", String(perPage));

      return params;
    });
  };

  // معالجة البحث
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value, page: 1 });
  };

  // معالجة تغيير الـ Partner
  const handlePartnerChange = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setSelectedBranchId(""); // إعادة تعيين الفرع عند تغيير الـ Partner
    updateURL({
      partner_id: partnerId,
      branch_id: "",
      page: 1,
    });
  };

  // معالجة تغيير الـ Branch
  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    updateURL({ branch_id: branchId, page: 1 });
  };

  // إعادة تعيين الفلاتر
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedPartnerId("");
    setSelectedBranchId("");
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("search");
      params.delete("partner_id");
      params.delete("branch_id");
      params.set("page", "1");
      return params;
    });
  };

  // Close modal
  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedSpecialist(null);
  };

  // Delete specialist
  const deleteSpecialistHandler = async (id: number) => {
    console.log("Delete specialist:", id);
    try {
      const result = await deleteSpecialist(id).unwrap();
      console.log("API Response:", result);
      toast.success(`${result?.message}`);
      closeModal();
    } catch (error) {
      console.error("Error Deleting specialist:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const confirmDelete = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setShowDeleteModal(true);
  };

  const filtersApplied = searchTerm || selectedPartnerId || selectedBranchId;

  // تحويل البيانات إلى options للـ Select
  const partnerOptions: OptionType[] = partners.map((p) => ({
    value: String(p.id),
    label: p.name,
    logo: p.logo_url ?? null,
  }));

  const branchOptions: OptionType[] = branches.map((branch) => ({
    value: String(branch.id),
    label: branch.name,
    logo: branch.logo_url ?? null,
  }));

  return (
    <div>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Specialist Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your business specialists and their details
            </p>
          </div>
          <Link to="/admins/specialists/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-md">
              <FaPlus className="mr-2" />
              Add New Specialist
            </Button>
          </Link>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                placeholder="Search specialists..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
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
                  partnerOptions.find(
                    (opt) => opt.value === selectedPartnerId
                  ) || null
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
                components={{ Option, SingleValue }}
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
              {selectedPartnerId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Partner:{" "}
                  {
                    partnerOptions.find((p) => p.value === selectedPartnerId)
                      ?.label
                  }
                  <button
                    onClick={() => handlePartnerChange("")}
                    className="ml-2 hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedBranchId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  Branch:{" "}
                  {
                    branchOptions.find((b) => b.value === selectedBranchId)
                      ?.label
                  }
                  <button
                    onClick={() => handleBranchChange("")}
                    className="ml-2 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                  <Th className="text-left">ID</Th>
                  <Th className="text-left">Specialist</Th>
                  <Th className="text-left">Contact</Th>
                  <Th className="text-left">Partner & Branch</Th>
                  <Th className="text-left">Title</Th>
                  <Th className="text-left">Gender</Th>
                  <Th className="text-left">Created</Th>
                  <Th className="text-center">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <Td colSpan={8} className="text-center py-8 text-gray-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-2">Loading specialists...</p>
                    </Td>
                  </tr>
                ) : error ? (
                  <tr>
                    <Td colSpan={8} className="text-center py-8 text-red-500">
                      Error loading specialists
                    </Td>
                  </tr>
                ) : specialists.length > 0 ? (
                  specialists.map((specialist: Specialist) => (
                    <tr
                      key={specialist.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Td className="font-medium text-gray-900">
                        #{specialist.id}
                      </Td>

                      <Td>
                        <div className="flex items-center space-x-3">
                          {specialist.logo_url ? (
                            <img
                              src={specialist.logo_url}
                              alt={specialist.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {specialist.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {specialist.name}
                            </div>
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {specialist.email}
                          </div>
                          <div className="text-gray-500">
                            {specialist.mobile}
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {specialist.partner?.name || "N/A"}
                          </div>
                          <div className="text-gray-500">
                            {specialist.medical_branch?.name || "N/A"}
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {specialist.title}
                        </span>
                      </Td>

                      <Td>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            specialist.gender === "male"
                              ? "bg-green-100 text-green-800"
                              : specialist.gender === "female"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {specialist.gender?.charAt(0).toUpperCase() +
                            specialist.gender?.slice(1) || "N/A"}
                        </span>
                      </Td>

                      <Td className="text-sm text-gray-500">
                        {formatDate(specialist.created_at)}
                      </Td>

                      <Td>
                        <div className="flex justify-center space-x-2">
                          <Link to={`/admins/specialists/${specialist.id}`}>
                            <Button
                              title="View"
                              size={"icon"}
                              variant={"ghost"}
                            >
                              <FaEye />
                            </Button>
                          </Link>
                          <Link
                            to={`/admins/specialists/${specialist.id}/edit`}
                          >
                            <Button
                              title="Edit"
                              variant={"ghost"}
                              size={"icon"}
                            >
                              <FaEdit />
                            </Button>
                          </Link>
                          <Button
                            title="Delete"
                            variant={"ghost"}
                            size={"icon"}
                            className="text-red-500 hover:text-red-700"
                            onClick={() => confirmDelete(specialist)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <Td colSpan={8} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">👨‍⚕️</div>
                        <p className="text-lg font-semibold">
                          No Specialists Found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {filtersApplied
                            ? "Try changing your search or filters"
                            : "No specialists available yet"}
                        </p>
                      </div>
                    </Td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer with pagination */}
          {!isLoading && !error && specialists.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing{" "}
                <span className="font-medium">{specialists.length}</span> of{" "}
                <span className="font-medium">{pagination.total}</span>{" "}
                specialists
              </div>

              <PaginationControls
                currentPage={page}
                totalPages={pagination.totalPages}
                perPage={perPage}
                onPageChange={(newPage, newPerPage) => {
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("page", String(newPage));
                    params.set("per_page", String(newPerPage));
                    if (searchTerm) params.set("search", searchTerm);
                    if (selectedPartnerId)
                      params.set("partner_id", selectedPartnerId);
                    if (selectedBranchId)
                      params.set("branch_id", selectedBranchId);
                    return params;
                  });
                }}
              />
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          title="Confirm Deletion"
          closeModal={closeModal}
        >
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete specialist "
              {selectedSpecialist?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedSpecialist &&
                  deleteSpecialistHandler(selectedSpecialist.id)
                }
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
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

export default SpecialistsPage;
