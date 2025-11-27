import React from "react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import type { Country } from "../../types";
import { Td, Th } from "../../components/ui/Tables";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  useCreateCountryMutation,
  useDeleteCountryMutation,
  useGetCountriesQuery,
  useUpdateCountryMutation,
} from "../../app/Api/Slices/CountryApiSlice";

interface CountryForm {
  name: string;
  code: string;
}

const Countries = () => {
  const { data, isLoading, error, refetch } = useGetCountriesQuery({});
  const countries = data?.data || [];

  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingCountry, setEditingCountry] = React.useState<Country | null>(
    null
  );
  const [deletingCountry, setDeletingCountry] = React.useState<Country | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CountryForm>();

  // Open create modal
  const openCreateModal = () => {
    setEditingCountry(null);
    reset();
    setIsOpen(true);
  };

  // Open edit modal
  const openEditModal = (country: Country) => {
    setEditingCountry(country);
    setValue("name", country.name);
    setValue("code", country.code);
    setIsOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (country: Country) => {
    setDeletingCountry(country);
  };

  // Close all modals
  const closeModals = () => {
    setIsOpen(false);
    setEditingCountry(null);
    setDeletingCountry(null);
    reset();
  };

  // Handle create and update
  const onSubmit = async (data: CountryForm) => {
    try {
      if (editingCountry) {
        // Update case
        await updateCountry({
          id: editingCountry.id,
          data: data,
        }).unwrap();
      } else {
        // Create case
        await createCountry(data).unwrap();
      }

      closeModals();
      refetch(); // Reload data
    } catch (error) {
      console.error("Error saving country:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCountry) return;

    try {
      await deleteCountry(deletingCountry.id).unwrap();
      closeModals();
      refetch(); // Reload data
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Countries</h1>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <FaPlus />
          Add Country
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <Th className="text-left">ID</Th>
                <Th className="text-left">Country Name</Th>
                <Th className="text-left">Country Code</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={4} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading countries...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={4} className="text-center py-8 text-red-500">
                    Error loading countries
                  </Td>
                </tr>
              ) : countries.length > 0 ? (
                countries.map((country: Country) => (
                  <tr
                    key={country.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{country.id}</Td>

                    <Td>
                      <span className="font-medium text-gray-900">
                        {country.name}
                      </span>
                    </Td>

                    <Td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {country.code}
                      </span>
                    </Td>

                    <Td>
                      <div className="flex justify-center space-x-2">
                        <Button
                          title="Edit"
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => openEditModal(country)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(country)}
                          isloading={isDeleting}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={4} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">🌍</div>
                      <p className="text-lg font-semibold">
                        No countries found
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Click "Add Country" to get started
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {!isLoading && !error && countries.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{countries.length}</span>{" "}
              countries
            </div>
          </div>
        )}
      </div>

      {/* Modal for create and edit */}
      <Modal
        isOpen={isOpen}
        closeModal={closeModals}
        title={editingCountry ? "Edit Country" : "Add New Country"}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Country Name"
            placeholder="Enter country name"
            {...register("name", {
              required: "Country name is required",
              minLength: {
                value: 2,
                message: "Country name must be at least 2 characters",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Input
            label="Country Code"
            placeholder="Enter country code (e.g., US, EG, SA)"
            {...register("code", {
              required: "Country code is required",
             
            })}
            error={!!errors.code}
            helperText={errors.code?.message}
          />

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closeModals}
              isloading={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" isloading={isCreating || isUpdating}>
              {editingCountry ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        isOpen={!!deletingCountry}
        closeModal={() => setDeletingCountry(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the country{" "}
            <span className="font-bold text-red-600">
              "{deletingCountry?.name}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone</p>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingCountry(null)}
              isloading={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={"outline"}
              onClick={handleDelete}
              isloading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Countries;
