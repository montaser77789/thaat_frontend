import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import Modal from "../../components/ui/Modal";
import { Td, Th } from "../../components/ui/Tables";
import { Link, useSearchParams } from "react-router-dom";
import {
  useDeletePartnerMutation,
  useGetPartenersQuery,
} from "../../app/Api/Slices/partenersApiSlice";
import type { Partner } from "../../interfaces/partener";
import { PaginationControls } from "../../components/ui/PaginationControls";
import { toast } from "react-toastify";

export default function Partners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletePartnerApi] = useDeletePartnerMutation();

  // جلب معاملات البحث من URL
  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") || "";

  // استخدام debounce للبحث
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);

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
    setStatusFilter(urlStatus);
  }, [urlSearch, urlStatus]);

  // استخدام الـ query مع جميع المعاملات
  const {
    data: partnersResponse,
    isLoading,
    error,
  } = useGetPartenersQuery({
    page,
    limit: perPage,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  });

  console.log("API Response:", partnersResponse);

  // البيانات من الـ API
  const partners = partnersResponse?.data || [];
  const pagination = partnersResponse?.pagination || {
    total: 0,
    totalPages: 1,
    currentPage: page,
    perPage,
  };

  // تحديث الـ URL عند تغيير الفلاتر
  const updateURL = (
    newSearch: string,
    newStatus: string,
    newPage: number = 1
  ) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      if (newStatus) {
        params.set("status", newStatus);
      } else {
        params.delete("status");
      }

      params.set("page", String(newPage));
      params.set("per_page", String(perPage));

      return params;
    });
  };

  // معالجة البحث
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // معالجة تغيير الـ status filter
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    updateURL(debouncedSearch, value, 1);
  };

  // إعادة تعيين الفلاتر
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("search");
      params.delete("status");
      params.set("page", "1");
      return params;
    });
  };

  // Toggle partner status
  const toggleStatus = (id: number) => {
    console.log("Toggle status for partner:", id);
  };

  // Delete partner
  const deletePartner = async (id: number) => {
    console.log("Delete partner:", id);
    try {
      const result = await deletePartnerApi(id).unwrap();
      console.log("API Response:", result);
      toast.success(`${result?.message}`);
      closeModal();
    } catch (error) {
      console.error("Error Deleting partner:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDeleteModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedPartner(null);
  };

  // التحقق إذا كان هناك فلاتر مفعلة
  const filtersApplied = searchTerm || statusFilter;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with title and add button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Partners Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your business partners and their branches
          </p>
        </div>
        <Link to="/admins/partners/addNewPartener">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-md">
            <FaPlus className="mr-2" />
            Add New Partner
          </Button>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search partners by name, email, or phone..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  updateURL(searchTerm, statusFilter, 1);
                }
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {filtersApplied && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {filtersApplied && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => {
                    setSearchTerm("");
                    updateURL("", statusFilter, 1);
                  }}
                  className="ml-2 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Status: {statusFilter === "ACTIVE" ? "Active" : "Inactive"}
                <button
                  onClick={() => handleStatusFilterChange("")}
                  className="ml-2 hover:text-green-600"
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
                <Th className="text-left">Partner Name (Eng)</Th>
                <Th className="text-left">Partner Name (Ar)</Th>
                <Th className="text-left">Contact Person</Th>
                <Th className="text-left">Contact Number</Th>
                <Th className="text-center">Email</Th>
                <Th className="text-center">Branches</Th>
                <Th className="text-center">Status</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={9} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading partners...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={9} className="text-center py-8 text-red-500">
                    Error loading partners
                  </Td>
                </tr>
              ) : partners.length > 0 ? (
                partners.map((partner: Partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{partner.id}</Td>
                    <Td className="font-medium">{partner.name}</Td>
                    <Td className="text-right font-medium" dir="rtl">
                      {partner.name_locale}
                    </Td>
                    <Td>{partner.contact_person_name}</Td>
                    <Td>{partner.contact_person_number}</Td>
                    <Td className="text-center text-gray-600">
                      {partner.contact_person_email}
                    </Td>
                    <Td className="text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-800 bg-blue-100 rounded-full">
                        {/* {partner.branches_count} */}
                        "_"
                      </span>
                    </Td>
                    <Td className="text-center">
                      <button
                        onClick={() => toggleStatus(partner.id)}
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
                      </button>
                    </Td>
                    <Td>
                      <div className="flex justify-center space-x-2">
                        <Link to={`/admins/partners/${partner.id}`}>
                          <Button title="View" size={"icon"} variant={"ghost"}>
                            <FaEye />
                          </Button>
                        </Link>
                        <Link to={`/admins/partners/${partner.id}/edit`}>
                          <Button title="Edit" variant={"ghost"} size={"icon"}>
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500"
                          onClick={() => confirmDelete(partner)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={9} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">🏢</div>
                      <p className="text-lg font-semibold">No Partners Found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {filtersApplied
                          ? "Try changing your search or filters"
                          : "No partners available yet"}
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        {!isLoading && !error && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing <span className="font-medium">{partners.length}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> partners
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
                  if (searchTerm) {
                    params.set("search", searchTerm);
                  }
                  if (statusFilter) {
                    params.set("status", statusFilter);
                  }
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
            Are you sure you want to delete partner "{selectedPartner?.name}"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedPartner && deletePartner(selectedPartner.id)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
