import {
  useDeleteBranchMutation,
  useGetBranchesQuery,
} from "../../app/Api/Slices/BranchesApiSlice";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { FaEdit, FaEye, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { Td, Th } from "../../components/ui/Tables";
import { PaginationControls } from "../../components/ui/PaginationControls";
import Modal from "../../components/ui/Modal";
import { useState } from "react";
import { useGetPartenersQuery } from "../../app/Api/Slices/partenersApiSlice";
import { toast } from "react-toastify";

// نوع البيانات للفرع
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
  };
  city: {
    id: number;
    name: string;
  };
  working_hours_per_day: Array<{
    id: number;
    day: string;
    start_time: string;
    end_time: string;
  }>;
  branchServices: Array<any>;
};

export default function Branches() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");
  const searchTerm = searchParams.get("search") || "";
  const partnerFilter = searchParams.get("partner_id") || "";
  const statusFilter = searchParams.get("status") || "";

  // جلب بيانات الفروع مع الفلترة
  const { data, isLoading, error } = useGetBranchesQuery({
    page,
    per_page: perPage,
    limit: perPage,
    search: searchTerm,
    status: statusFilter,
    partner_id: partnerFilter,
  });
  console.log(data);

  // جلب بيانات الشركاء للفلتر
  const { data: partnersData } = useGetPartenersQuery({
    limit: 100,
    page: 1,
  });

  const branches: Branch[] = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,

    totalPages: 1,
    currentPage: page,
    perPage,
  };

  const partners = partnersData?.data || [];

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  // معالجة البحث والفلترة
  const handleSearch = (search: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      return params;
    });
  };

  const handlePartnerFilter = (partnerId: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (partnerId) {
        params.set("partner_id", partnerId);
      } else {
        params.delete("partner_id");
      }
      params.set("page", "1");
      return params;
    });
  };

  const handleStatusFilter = (status: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (status) {
        params.set("status", status);
      } else {
        params.delete("status");
      }
      params.set("page", "1");
      return params;
    });
  };

  const confirmDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedBranch(null);
  };

  const handleDelete = async () => {
    if (selectedBranch) {
      try {
        const res = await deleteBranch(selectedBranch.id).unwrap();
        closeModal();
        toast.success(res.message);
        console.log(res);
      } catch (error) {
        console.error("Failed to delete branch:", error);
      }
    }
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const filtersApplied = searchTerm || partnerFilter || statusFilter;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with title and add button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Branch Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage branches and their details
          </p>
        </div>
        <Link to="/admins/branches/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-md">
            <FaPlus className="mr-2" />
            Add New Branch
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Partner Filter */}
          <select
            value={partnerFilter}
            onChange={(e) => handlePartnerFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Partners</option>
            {partners.map((partner: any) => (
              <option key={partner.id} value={String(partner.id)}>
                {" "}
                {/* تأكد من استخدام String() */}
                {partner.name}
              </option>
            ))}
          </select>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* Clear Filters */}
          {filtersApplied && (
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <Th className="text-left">ID</Th>
                <Th className="text-left">Branch Name (Eng)</Th>
                <Th className="text-left">Branch Name (Ar)</Th>
                <Th className="text-left">Partner</Th>
                <Th className="text-left">Contact Person</Th>
                <Th className="text-left">Contact Number</Th>
                <Th className="text-left">Email</Th>
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
                    <p className="mt-2">Loading branches...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={9} className="text-center py-8 text-red-500">
                    Error loading branches
                  </Td>
                </tr>
              ) : branches.length > 0 ? (
                branches.map((branch: Branch) => (
                  <tr
                    key={branch.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{branch.id}</Td>
                    <Td className="font-medium">{branch.name}</Td>
                    <Td className="text-right font-medium" dir="rtl">
                      {branch.name_locale}
                    </Td>
                    <Td>{branch.partner?.name}</Td>
                    <Td>{branch.contact_person_name}</Td>
                    <Td>{branch.contact_person_number}</Td>
                    <Td className="text-gray-600">
                      {branch.contact_person_email}
                    </Td>
                    <Td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          branch.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1 ${
                            branch.status === "ACTIVE"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {branch.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex justify-center space-x-2">
                        <Link to={`/admins/branches/${branch.id}`}>
                          <Button title="View" size={"icon"} variant={"ghost"}>
                            <FaEye />
                          </Button>
                        </Link>
                        <Link to={`/admins/branches/${branch.id}/edit`}>
                          <Button title="Edit" variant={"ghost"} size={"icon"}>
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => confirmDelete(branch)}
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
                      <p className="text-lg font-semibold">No branches Found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {filtersApplied
                          ? "Try changing your search or filters"
                          : "No branches available yet"}
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        {!isLoading && !error && branches.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing <span className="font-medium">{branches.length}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> branches
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
                  if (partnerFilter) params.set("partner_id", partnerFilter);
                  if (statusFilter) params.set("status", statusFilter);
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
            Are you sure you want to delete branch "{selectedBranch?.name}"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
