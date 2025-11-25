import React, { useState } from "react";
import {
  useDeleteCatagoryMutation,
  useGetAllCatagoryQuery,
} from "../../app/Api/Slices/catagoryApiSlice";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { PaginationControls } from "../../components/ui/PaginationControls";
import { Td, Th } from "../../components/ui/Tables";
import { toast } from "react-toastify";

interface Catagory {
  id: number;
  name_ar: string;
  name_en: string;
  file: string;
}

const CategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");
  const [deleteCatagory] = useDeleteCatagoryMutation();

  const {
    data: categoriesData,
    isLoading,
    error,
  } = useGetAllCatagoryQuery({
    page,
    limit: perPage,
    search: searchTerm,
  });

  const categories: Catagory[] = categoriesData?.data || [];
  const pagination = categoriesData?.pagination || {
    total: 0,
    totalPages: 1,
    currentPage: page,
    perPage,
  };

  // دالة حذف الكاتيجوري
  const confirmDelete = async (category: Catagory) => {
    try {
      await deleteCatagory(category.id).unwrap();
      toast.success("Category deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  // دالة البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", "1"); // العودة للصفحة الأولى عند البحث
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      return params;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Category Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your business categories and their details
          </p>
        </div>
        <Link to="/admins/categories/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-md">
            <FaPlus className="mr-2" />
            Add New Category
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setSearchParams((prev) => {
                  const params = new URLSearchParams(prev);
                  params.delete("search");
                  params.set("page", "1");
                  return params;
                });
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                <Th className="text-left">ID</Th>
                <Th className="text-left">Image</Th>
                <Th className="text-left">Name Arabic</Th>
                <Th className="text-left">Name English</Th>
                <Th className="text-left">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={5} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading categories...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={5} className="text-center py-8 text-red-500">
                    Error loading categories
                  </Td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((category: Catagory) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">
                      #{category.id}
                    </Td>
                    <Td>
                      {category.file ? (
                        <img
                          src={category.file}
                          alt={category.name_ar}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className="font-medium text-gray-900">
                        {category.name_ar}
                      </div>
                    </Td>
                    <Td>
                      <div className="font-medium text-gray-900">
                        {category.name_en}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex justify-start space-x-2">
                        <Link to={`/admins/categories/${category.id}/edit`}>
                          <Button
                            title="Edit"
                            variant={"ghost"}
                            size={"icon"}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => confirmDelete(category)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={5} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-lg font-semibold">
                        No Categories Found
                      </p>
                      <p className="text-gray-600 mt-1">
                        {searchTerm
                          ? "Try changing your search terms"
                          : "Get started by creating a new category"}
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-700 mb-2 md:mb-0">
              Showing{" "}
              <span className="font-medium">
                {Math.min((page - 1) * perPage + 1, pagination.total)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * perPage, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span>{" "}
              categories
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
                  return params;
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
