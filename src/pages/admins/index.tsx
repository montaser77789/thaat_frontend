import React from "react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import type { Admin } from "../../types";
import { Td, Th } from "../../components/ui/Tables";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  useCreateadminMutation,
  useDeleteadminMutation,
  useGetadminQuery,
  useUpdateadminMutation,
} from "../../app/Api/Slices/AdminApiSlice";

interface AdminForm {
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  password_digest?: string;
  gender: "male" | "female";
}

const Admins = () => {
  const { data, isLoading, error, refetch } = useGetadminQuery({});
  const admins = data?.data?.users;

  const [createAdmin, { isLoading: isCreating }] = useCreateadminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateadminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteadminMutation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [editingAdmin, setEditingAdmin] = React.useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = React.useState<Admin | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminForm>();

  // Open create modal
  const openCreateModal = () => {
    setEditingAdmin(null);
    reset();
    setIsOpen(true);
  };

  // Open edit modal
  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setValue("first_name", admin.first_name || "");
    setValue("last_name", admin.last_name || "");
    setValue("mobile", admin.mobile);
    setValue("email", admin.email || "");
    setValue("gender", admin.gender === 1 ? "male" : "female");
    setIsOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (admin: Admin) => {
    setDeletingAdmin(admin);
  };

  // Close all modals
  const closeModals = () => {
    setIsOpen(false);
    setEditingAdmin(null);
    setDeletingAdmin(null);
    reset();
  };

  // Handle create and update
  const onSubmit = async (data: AdminForm) => {
    try {
      const adminData = {
        first_name: data.first_name,
        last_name: data.last_name,
        mobile: data.mobile,
        email: data.email,
        gender: data.gender === "male" ? 1 : 2,
        ...(data.password_digest && { password: data.password_digest }), // Only include password if provided
      };

      if (editingAdmin) {
        // Update case
        await updateAdmin({
          id: editingAdmin.id,
          data: adminData,
        }).unwrap();
      } else {
        // Create case - password is required for creation
        await createAdmin({
          ...adminData,
          password_digest: data.password_digest || "", // Required for creation
        }).unwrap();
      }

      closeModals();
      refetch(); // Reload data
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingAdmin) return;

    try {
      await deleteAdmin(deletingAdmin.id).unwrap();
      closeModals();
      refetch(); // Reload data
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  // Format gender display
  const formatGender = (gender: number) => {
    return gender === 1 ? "Male" : "Female";
  };

  // Format full name
  const formatFullName = (admin: Admin) => {
    return `${admin.first_name || ""} ${admin.last_name || ""}`.trim();
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admins</h1>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <FaPlus />
          Add Admin
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-400 text-white">
                <Th className="text-left">ID</Th>
                <Th className="text-left">Name</Th>
                <Th className="text-left">Mobile</Th>
                <Th className="text-left">Email</Th>
                <Th className="text-left">Gender</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <Td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2">Loading admins...</p>
                  </Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={6} className="text-center py-8 text-red-500">
                    Error loading admins
                  </Td>
                </tr>
              ) : admins?.length > 0 ? (
                admins.map((admin: Admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Td className="font-medium text-gray-900">#{admin.id}</Td>

                    <Td>
                      <span className="font-medium text-gray-900">
                        {formatFullName(admin)}
                      </span>
                    </Td>

                    <Td>
                      <span className="text-gray-600">{admin.mobile}</span>
                    </Td>

                    <Td>
                      <span className="text-gray-600">
                        {admin.email || "-"}
                      </span>
                    </Td>

                    <Td>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.gender === 1
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {formatGender(admin.gender)}
                      </span>
                    </Td>

                    <Td>
                      <div className="flex justify-center space-x-2">
                        {/* <Button
                          title="Edit"
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => openEditModal(admin)}
                        >
                          <FaEdit />
                        </Button> */}
                        <Button
                          title="Delete"
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteModal(admin)}
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
                  <Td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">👨‍💼</div>
                      <p className="text-lg font-semibold">No admins found</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Click "Add Admin" to get started
                      </p>
                    </div>
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {!isLoading && !error && admins?.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{admins?.length}</span>{" "}
              admins
            </div>
          </div>
        )}
      </div>

      {/* Modal for create and edit */}
      <Modal
        isOpen={isOpen}
        closeModal={closeModals}
        title={editingAdmin ? "Edit Admin" : "Add New Admin"}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              {...register("first_name", {
                required: "First name is required",
              })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />

            <Input
              label="Last Name"
              placeholder="Enter last name"
              {...register("last_name", {
                required: "Last name is required",
              })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
          </div>

          <Input
            label="Mobile"
            placeholder="Enter mobile number"
            type="tel"
            {...register("mobile", {
              required: "Mobile is required",
              pattern: {
                value: /^[0-9+\-\s()]+$/,
                message: "Please enter a valid mobile number",
              },
            })}
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
          />

          <Input
            label="Email"
            placeholder="Enter email address"
            type="email"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {!editingAdmin && (
            <Input
              label="Password"
              placeholder="Enter password"
              type="password"
              {...register("password_digest", {
                required: "Password is required for new admin",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password_digest}
              helperText={errors.password_digest?.message}
            />
          )}

          {editingAdmin && (
            <Input
              label="New Password (optional)"
              placeholder="Enter new password to change"
              type="password"
              {...register("password_digest", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password_digest}
              helperText={errors.password_digest?.message}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="male"
                  {...register("gender", { required: "Gender is required" })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="female"
                  {...register("gender", { required: "Gender is required" })}
                  className="text-pink-600 focus:ring-pink-500"
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

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
              {editingAdmin ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        isOpen={!!deletingAdmin}
        closeModal={() => setDeletingAdmin(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the admin{" "}
            <span className="font-bold text-red-600">
              "{deletingAdmin && formatFullName(deletingAdmin)}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone</p>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingAdmin(null)}
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

export default Admins;
