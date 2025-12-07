import  { useState } from "react";
import {
  useDeleteServiceMutation,
  useGetServicesQuery,
} from "../../app/Api/Slices/ServiceApiSlice";
import Button from "../../components/ui/Button";
import { Link, useSearchParams } from "react-router-dom";
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { customStyles, type OptionType } from "../../types";
import Select from "react-select";
import { useGetCatagoresQuery } from "../../app/Api/Slices/catagoryApiSlice";
import { PaginationControls } from "../../components/ui/PaginationControls";
import { Td, Th } from "../../components/ui/Tables";
import { toast } from "react-toastify";

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");
  const urlSearch = searchParams.get("search") || "";
  const urlCategoryId = searchParams.get("category_id") || "";

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>(urlCategoryId);
  const [searchTerm, setSearchTerm] = useState<string>(urlSearch);

  const {
    data: services,
    isLoading,
    error,
  } = useGetServicesQuery({
    limit: perPage,
    page: page,
    search: urlSearch,
    category_id: urlCategoryId,
  });
  console.log("services", services);

  const { data: catagoryData } = useGetCatagoresQuery({});
  const [deleteService] = useDeleteServiceMutation();

  // البيانات من الـ API
  const servicesData = services?.data.services || [];
  const pagination = services?.pagination || {
    total: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: perPage,
  };

  const categories = catagoryData?.data || [];


  const categoryOptions: OptionType[] = categories.map((category: any) => ({
    value: String(category.id),
    label: category.name_ar || category.name_en || category.name,
  }));

  // دالة تحديث الفلاتر
  const updateFilters = (updates: {
    search?: string;
    city_id?: string;
    category_id?: string;
    page?: number;
  }) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      const updatesMap = {
        search: updates.search,
        city_id: updates.city_id,
        category_id: updates.category_id,
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

      params.set("page", String(updates.page || 1));
      params.set("per_page", String(perPage));

      return params;
    });
  };

  // معالجة البحث
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value, page: 1 });
  };



  // معالجة تغيير التصنيف
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    updateFilters({ category_id: categoryId, page: 1 });
  };

  // تأكيد الحذف
  const confirmDelete = (service: any) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  // إغلاق المودال
  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedService(null);
  };

  // تنفيذ الحذف
  const deleteServiceHandler = async (id: number) => {
    try {
      const result = await deleteService(id).unwrap();
      closeModal();
      toast.success(`${result?.message}`);
    } catch (error: unknown | any) {
      console.error("Error creating  request:", error);
      toast.error(error?.data?.message);
    }
  };

  // التحقق إذا كان هناك فلاتر مطبقة
  const filtersApplied = urlSearch  || urlCategoryId;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Service Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your business services and their details
          </p>
        </div>
        <Link to="/admins/services/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-md">
            <FaPlus className="mr-2" />
            Add New Service
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="absolute inset-y-0 top-7 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search services..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

   

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select<OptionType>
              options={categoryOptions}
              value={
                categoryOptions.find(
                  (opt) => opt.value === selectedCategoryId
                ) || null
              }
              onChange={(opt) => handleCategoryChange(opt?.value || "")}
              placeholder="Select Category"
              isClearable
              styles={customStyles}
            />
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Code</Th>
                <Th>Cost</Th>
                <Th>Price</Th>
                <Th>City</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading services...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={8} className="text-center py-8 text-red-500">
                    Error loading services
                  </Td>
                </tr>
              ) : servicesData.length > 0 ? (
                servicesData.map((service: any) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{service.id}</Td>
                    <Td className="font-medium text-gray-900">
                      {service.name}
                    </Td>
                    <Td className="text-gray-700">{service.code}</Td>
                    <Td className="text-gray-700">${service.cost}</Td>
                    <Td className="text-gray-700">${service.price}</Td>
                    <Td>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {service.city?.name}
                      </span>
                    </Td>
                    <Td>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {service.catagory?.name_ar}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex justify-center space-x-2">
                        <Link to={`/admins/services/${service.id}`}>
                          <Button title="View" size={"icon"} variant={"ghost"}>
                            <FaEye />
                          </Button>
                        </Link>
                        <Link to={`/admins/services/${service.id}/edit`}>
                          <Button title="Edit" variant={"ghost"} size={"icon"}>
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => confirmDelete(service)}
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
                      <div className="text-4xl mb-2">📦</div>
                      <p className="text-lg font-semibold">No Services Found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {filtersApplied
                          ? "Try changing your search or filters"
                          : "No services available yet"}
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !error && servicesData.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing <span className="font-medium">{servicesData.length}</span>{" "}
              of <span className="font-medium">{pagination.total}</span>{" "}
              services
            </div>

            <PaginationControls
              currentPage={page}
              totalPages={
                pagination.totalPages || Math.ceil(pagination.total / perPage)
              }
              perPage={perPage}
              onPageChange={(newPage, newPerPage) => {
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.set("page", String(newPage));
                  params.set("per_page", String(newPerPage));
                  if (urlSearch) params.set("search", urlSearch);
                  if (urlCategoryId) params.set("category_id", urlCategoryId);
                  return params;
                });
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedService && (
        <div className="fixed inset-0 bg-black/80 z-100 bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Service
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete service "{selectedService.name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteServiceHandler(selectedService.id)}
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

export default Services;
