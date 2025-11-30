import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useGetCityQuery } from "../../../app/Api/Slices/CityApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import createServiceSchema from "../../../validation/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { customStyles, type OptionType } from "../../../types";
import { useGetCatagoresQuery } from "../../../app/Api/Slices/catagoryApiSlice";
import type { Catagory } from "../../categories";
import { FiCheckCircle, FiDownload, FiFileText, FiMapPin, FiUpload, FiUser, FiX } from "react-icons/fi";
import Select from "react-select";
import {
  useCreateServiceMutation,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
} from "../../../app/Api/Slices/ServiceApiSlice";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

// تعريف الـ type بناءً على الـ schema
type ServiceForm = {
  name: string;
  cost: string;
  price: string;
  code: string;
  catagory_id: string;
  city_id: string;
  file?: File | null;
};

const defaultServiceValues: ServiceForm = {
  name: "",
  cost: "",
  price: "",
  code: "",
  catagory_id: "",
  city_id: "",
  file: undefined,
};

const AddNewService = () => {
  const navigate = useNavigate();
  const params = useParams();
  const idService = params.id;
  const isEditMode = Boolean(idService);
  
  const { data: citiesData, isLoading: citiesLoading } = useGetCityQuery({});
  const { data: catagoryData } = useGetCatagoresQuery({});
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: defaultServiceValues,
  });

  const [createService, { isLoading: isAdding }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const { data: serviceData, isLoading: isLoadingService } = 
    useGetServiceByIdQuery(idService!, { skip: !isEditMode });
  console.log(serviceData , isEditMode);

  useEffect(() => {
    if (isEditMode && serviceData) {
      const formData: ServiceForm = {
        name: serviceData?.data.name || "",
        cost: serviceData?.data.cost || "",
        price: serviceData?.data.price || "",
        code: serviceData?.data.code || "",
        catagory_id: serviceData?.data.catagory_id || "",
        city_id: serviceData?.data.city_id || "",
      };

      reset(formData);
      setValue("file", serviceData?.data.file || "");
    }

  }, [isEditMode, serviceData, reset]);

  const cities = citiesData?.data || [];
  const catagories = catagoryData?.data || [];

  const cityOptions = useMemo(
    () =>
      cities.map((city: any) => ({
        value: String(city.id),
        label: city.name,
      })),
    [cities]
  );

  const catagoryOptions: OptionType[] = useMemo(
    () =>
      catagories.map((p: Catagory) => ({
        value: String(p.id),
        label: p.name_en,
      })),
    [catagories]
  );

  const fileRef = useRef<HTMLInputElement>(null);
  const fileValue = watch("file");

  const onSubmit = async (data: ServiceForm) => {
    try {
      const formData = new FormData();
      
      // Append basic data
      formData.append("name", data.name);
      formData.append("cost", data.cost);
      formData.append("price", data.price);
      formData.append("code", data.code);
      formData.append("catagory_id", data.catagory_id);
      formData.append("city_id", data.city_id);

      // Append file if exists
      if (data.file instanceof File) {
        formData.append("file", data.file);
      }

      if (isEditMode && idService) {
        // Update service
        await updateService({ id: idService, data: formData }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        // Create service
        await createService(formData).unwrap();
        toast.success("Service created successfully!");
      }

      navigate("/admins/services"); // Redirect to services list
    } catch (error: any) {
      console.error("Error saving service:", error);
      toast.error(error?.data?.message || "Failed to save service");
    }
  };

  const isLoading = isAdding || isUpdating || isLoadingService;

  const getCurrentFile = (): File | null | undefined => {
    return fileValue;
  };

  const removeFile = () => {
    if (isEditMode) {
      setValue("file", null, { shouldValidate: true });
      toast.info(`File marked for deletion. Save changes to confirm.`);
    } else {
      setValue("file", undefined, { shouldValidate: true });
    }

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleFileChange = (file: File) => {
    setValue("file", file, { shouldValidate: true });
  };

  const renderFileUpload = () => {
    const existingFileUrl = isEditMode && serviceData?.file;

    const hasExistingFile =
      existingFileUrl &&
      existingFileUrl !== "null" &&
      existingFileUrl !== "undefined" &&
      existingFileUrl.trim() !== "";

    const isFileDeleted = watch("file") === null;
    const currentFile = getCurrentFile();

    const getFileType = (url: string) => {
      if (!url) return "unknown";
      const extension = url?.split(".").pop()?.toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg"]?.includes(extension || "")
      ) {
        return "image";
      } else if (extension === "pdf") {
        return "pdf";
      } else if (["doc", "docx"]?.includes(extension || "") || extension === "odt") {
        return "word";
      } else {
        return "file";
      }
    };

    const existingFileType = hasExistingFile
      ? getFileType(existingFileUrl)
      : "unknown";

    return (
      <div className="space-y-3">
        <label className="font-bold text-gray-800 flex items-center gap-2">
          <FiFileText className="text-blue-600" />
          Service Logo
        </label>

        {isEditMode && isFileDeleted && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FiX className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  File will be deleted
                </p>
                <p className="text-xs text-red-600">
                  Click upload to add a new file or save to confirm deletion
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setValue("file", undefined);
                toast.info("File deletion cancelled");
              }}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              <FiX className="h-4 w-4" />
              Cancel Delete
            </button>
          </div>
        )}

        {isEditMode && hasExistingFile && !currentFile && !isFileDeleted && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {existingFileType === "image" ? (
                <div className="relative">
                  <img
                    src={existingFileUrl}
                    alt="Service Logo"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200';
                        fallback.innerHTML = '<span class="text-gray-400 text-xs">Error</span>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                    <FiCheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
              ) : (
                <div
                  className={`p-3 rounded-lg ${
                    existingFileType === "pdf"
                      ? "bg-red-100 text-red-600"
                      : existingFileType === "word"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {existingFileType === "pdf" ? (
                    <FiFileText className="h-6 w-6" />
                  ) : existingFileType === "word" ? (
                    <FiFileText className="h-6 w-6" />
                  ) : (
                    <FiFileText className="h-6 w-6" />
                  )}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-green-800">
                  File already uploaded
                </p>
                <p className="text-xs text-green-600 capitalize">
                  {existingFileType} file • Click upload to replace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => window.open(existingFileUrl, "_blank")}
                variant={"ghost"}
                className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors"
              >
                <FiCheckCircle className="h-4 w-4" />
                View
              </Button>

              <Button
                type="button"
                variant={"ghost"}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = existingFileUrl;
                  link.download = `service_logo.${existingFileUrl?.split(".").pop()}`;
                  link.click();
                }}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-1 rounded hover:bg-purple-50 transition-colors"
              >
                <FiDownload className="h-4 w-4" />
                Download
              </Button>

              <Button
                type="button"
                variant={"ghost"}
                onClick={removeFile}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <FiX className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300 bg-gray-50/50 hover:bg-blue-50/50">
          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 10 * 1024 * 1024) {
                  toast.error("File size must be less than 10MB");
                  return;
                }
                handleFileChange(file);
              }
            }}
          />

          {!currentFile && !isFileDeleted ? (
            <div
              className="cursor-pointer group"
              onClick={() => fileRef.current?.click()}
            >
              <FiUpload className="mx-auto h-10 w-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm text-gray-600 font-medium">
                {isEditMode && hasExistingFile
                  ? "Click to replace file"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, PDF, DOC up to 10MB
              </p>
            </div>
          ) : currentFile ? (
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-green-200 shadow-sm">
              <div className="flex items-center space-x-3">
                {currentFile?.type?.startsWith("image/") ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(currentFile)}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <FiCheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-3 rounded-lg ${
                      currentFile.type === "application/pdf"
                        ? "bg-red-100 text-red-600"
                        : currentFile?.type?.includes("word")
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {currentFile?.type === "application/pdf" ? (
                      <FiFileText className="h-6 w-6" />
                    ) : currentFile?.type?.includes("word") ? (
                      <FiFileText className="h-6 w-6" />
                    ) : (
                      <FiFileText className="h-6 w-6" />
                    )}
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {currentFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(currentFile.size / 1024 / 1024).toFixed(2)} MB •
                    <span className="ml-1 capitalize">
                      {currentFile.type?.split("/")[1] || "file"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentFile?.type?.startsWith("image/") && (
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={() => {
                      const url = URL.createObjectURL(currentFile);
                      window.open(url, "_blank");
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <FiCheckCircle className="h-4 w-4" />
                    Preview
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={removeFile}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  <FiX className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Service" : "Add New Service"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update service information and details"
            : "Create a new service with the form below"}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Name *"
            placeholder="Enter service name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isLoading}
            icon={<FiUser />}
          />

          <Input
            label="Cost *"
            placeholder="Enter service cost"
            type="number"
            {...register("cost")}
            error={!!errors.cost}
            helperText={errors.cost?.message}
            disabled={isLoading}
            icon={<FiUser />}
          />

          <Input
            label="Price *"
            placeholder="Enter service price"
            type="number"
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
            disabled={isLoading}
            icon={<FiUser />}
          />

          <Input
            label="Code *"
            placeholder="Enter service code"
            {...register("code")}
            error={!!errors.code}
            helperText={errors.code?.message}
            disabled={isLoading}
            icon={<FiUser />}
          />

          <div>
            <label className="font-bold text-gray-700 mb-1 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              City *
            </label>
            <Controller
              control={control}
              name="city_id"
              render={({ field }) => (
                <Select
                  options={cityOptions}
                  isLoading={citiesLoading}
                  value={
                    cityOptions.find(
                      (o: OptionType) => o.value === field.value
                    ) ?? null
                  }
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                  }}
                  placeholder="Select city"
                  styles={customStyles}
                  isDisabled={isLoading}
                />
              )}
            />
            {errors.city_id && (
              <p className="text-sm text-red-600 mt-1">
                {errors.city_id?.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-bold text-gray-700 mb-1 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              Category *
            </label>
            <Controller
              control={control}
              name="catagory_id"
              render={({ field }) => (
                <Select <{label: string , value: string}>
                  options={catagoryOptions}
                  value={
                    catagoryOptions.find(
                      (o: OptionType) => o.value === field.value
                    ) ?? null
                  }
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                  }}
                  placeholder="Select category"
                  styles={customStyles}
                  isDisabled={isLoading}
                />
              )}
            />
            {errors.catagory_id && (
              <p className="text-sm text-red-600 mt-1">
                {errors.catagory_id?.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {renderFileUpload()}
          {errors.file && (
            <p className="text-red-600 text-sm mt-1">
              {errors.file?.message as string}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/services")}
            isloading={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isloading={isLoading}
          >
            {isEditMode ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewService;