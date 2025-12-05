import React from "react";
import {
  useCreateCityMutation,
  useDeleteCityMutation,
  useGetCityQuery,
  useUpdateCityMutation,
} from "../../app/Api/Slices/CityApiSlice";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import type { City } from "../../types";
import { Td, Th } from "../../components/ui/Tables";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Cities = () => {
  const { data, isLoading, error, refetch } = useGetCityQuery({});
  const cities = data?.data || [];

  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();
  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingCity, setEditingCity] = React.useState<City | null>(null);
  const [deletingCity, setDeletingCity] = React.useState<City | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<City>();

  // Open create modal
  const openCreateModal = () => {
    setEditingCity(null);
    reset();
    setIsOpen(true);
  };

  // Open edit modal
  const openEditModal = (city: City) => {
    setEditingCity(city);
    setValue("name", city.name);
    setIsOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (city: City) => {
    setDeletingCity(city);
  };

  // Close all modals
  const closeModals = () => {
    setIsOpen(false);
    setEditingCity(null);
    setDeletingCity(null);
    reset();
  };

  // Handle create and update
  const onSubmit = async (data: City) => {
    try {
      if (editingCity) {
        // Update case
        await updateCity({
          id: editingCity.id,
          data: data,
        }).unwrap();
      } else {
        // Create case
        await createCity(data).unwrap();
      }

      closeModals();
      refetch(); // Reload data
    } catch (error: unknown | any) {
      console.error("Error creating  request:", error);
      toast.error(error?.data?.message);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCity) return;

    try {
      await deleteCity(deletingCity.id).unwrap();
      closeModals();
      refetch(); // Reload data
    } catch (error: unknown | any) {
      console.error("Error creating  request:", error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cities</h1>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <FaPlus />
          Add City
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                <Th className="text-left">ID</Th>
                <Th className="text-left">City Name</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={3} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading cities...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={3} className="text-center py-8 text-red-500">
                    Error loading cities
                  </Td>
                </tr>
              ) : cities.length > 0 ? (
                cities.map((city: City) => (
                  <tr
                    key={city.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{city.id}</Td>

                    <Td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {city.name}
                      </span>
                    </Td>

                    <Td>
                      <div className="flex justify-center space-x-2">
                        <Button
                          title="Edit"
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => openEditModal(city)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(city)}
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
                  <Td colSpan={3} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">🏙️</div>
                      <p className="text-lg font-semibold">No cities found</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Click "Add City" to get started
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {!isLoading && !error && cities.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{cities.length}</span>{" "}
              cities
            </div>
          </div>
        )}
      </div>

      {/* Modal for create and edit */}
      <Modal
        isOpen={isOpen}
        closeModal={closeModals}
        title={editingCity ? "Edit City" : "Add New City"}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="City Name"
            placeholder="Enter city name"
            {...register("name", {
              required: "City name is required",
              minLength: {
                value: 2,
                message: "City name must be at least 2 characters",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
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
              {editingCity ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        isOpen={!!deletingCity}
        closeModal={() => setDeletingCity(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the city{" "}
            <span className="font-bold text-red-600">
              "{deletingCity?.name}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone</p>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingCity(null)}
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

export default Cities;
