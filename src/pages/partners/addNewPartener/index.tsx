import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import Input from "../../../components/ui/Input";
import "react-international-phone/style.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useState, useRef, useEffect } from "react";
import type { RefObject } from "react";
import Select from "../../../components/ui/Select";
import { useGetCityQuery } from "../../../app/Api/Slices/CityApiSlice";
import {
  FiUpload,
  FiX,
  FiImage,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiBriefcase,
  FiSave,
  FiArrowLeft,
  FiHome,
  FiDownload,
} from "react-icons/fi";
import { partenerSchema } from "../../../validation/partener";
import { useGetCountryQuery } from "../../../app/Api/Slices/CountryApiSlice";
import {
  useCreatePartenerMutation,
  useGetPartenerByIdQuery,
  useUpdatePartenerMutation,
} from "../../../app/Api/Slices/partenersApiSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import type { Partner } from "../../../interfaces/partener";
import { handleApiError } from "../../../app/utils/handleApiError";
import Button from "../../../components/ui/Button";

const AddNewPartener = () => {
  const navigate = useNavigate();
  const params = useParams();
  const idPartener = params.id;

  const isEditMode = Boolean(idPartener);
  const [_, setPhoneValue] = useState<string>("");

  const { data: countriesData, isLoading: countriesLoading } =
    useGetCountryQuery({});
  const { data: citiesData, isLoading: citiesLoading } = useGetCityQuery({});

  const countries = countriesData?.data || [];
  const cities = citiesData?.data || [];

  const { data: partnerResponse, isLoading: isLoadingSingle } =
    useGetPartenerByIdQuery(idPartener, {
      skip: !isEditMode, // لا نجلب البيانات إلا في وضع التعديل
    });

  const [createPartener, { isLoading: isCreating }] =
    useCreatePartenerMutation();
  const [updatePartener, { isLoading: isUpdating }] =
    useUpdatePartenerMutation();

  // Refs for file inputs
  const logoRef = useRef<HTMLInputElement>(null);
  const crDocRef = useRef<HTMLInputElement>(null);
  const vatDocRef = useRef<HTMLInputElement>(null);
  const mohDocRef = useRef<HTMLInputElement>(null);
  const agreementDocRef = useRef<HTMLInputElement>(null);
  const otherDocRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof partenerSchema>>({
    resolver: zodResolver(partenerSchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (isEditMode && partnerResponse?.data) {
      const partner = partnerResponse.data;

      setValue("name", partner.name);
      setValue("name_locale", partner.name_locale);
      setValue("contact_person_name", partner.contact_person_name);
      setValue("contact_person_email", partner.contact_person_email);
      setValue("contact_person_number", partner.contact_person_number);
      setValue("password", partner.password);
      setValue("cr_number", partner.cr_number);
      setValue("address", partner.address);
      setValue("location", partner.location);
      setValue("vat_number", partner.vat_number || "");
      setValue("moh_number", partner.moh_number || "");
      setValue("status", partner.status);
      setValue("country_id", partner.country_id.toString());
      setValue("city_id", partner.city_id.toString());

      // تعبئة رقم الهاتف في state
      setPhoneValue(partner.contact_person_number);
    }
  }, [isEditMode, partnerResponse, setValue]);

  // Watch file values for preview
  const logoFile = watch("logo_url");
  const crDocFile = watch("cr_document_url");
  const vatDocFile = watch("vat_document_url");
  const mohDocFile = watch("moh_document_url");
  const agreementDocFile = watch("agreement_document_url");
  const otherDocFile = watch("other_document_url");

  const handleAddPartener = async (data: z.infer<typeof partenerSchema>) => {
    try {
      const formData = new FormData();

      // Append all form data
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof z.infer<typeof partenerSchema>];

        if (key.includes("_url") && value instanceof File) {
          formData.append(key, value);
        } else if (key === "contact_person_number") {
          const rawPhone = value || "";
          const normalizedPhone = rawPhone.replace(/^\+/, "");
          formData.append(key, normalizedPhone);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      console.log("Form Data to be sent:", Object.fromEntries(formData));

      const result = await createPartener(formData).unwrap();

      toast.success("Partner created successfully!");
      console.log("API Response:", result);

      reset();

      [
        logoRef,
        crDocRef,
        vatDocRef,
        mohDocRef,
        agreementDocRef,
        otherDocRef,
      ].forEach((ref) => {
        if (ref.current) ref.current.value = "";
      });

      // الانتقال إلى صفحة الشركاء بعد نجاح الإنشاء
      setTimeout(() => {
        navigate("/admins/partners");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating partner:", error);
      handleApiError(error, "create");
    }
  };

  const handleEditPartener = async (data: z.infer<typeof partenerSchema>) => {
    try {
      const formData = new FormData();

      // Append all form data
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof z.infer<typeof partenerSchema>];

        if (key.includes("_url")) {
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value === null) {
            formData.append(key, "null");
          }
        } else if (key === "contact_person_number") {
          const rawPhone = value || "";
          const normalizedPhone = rawPhone.replace(/^\+/, "");
          formData.append(key, normalizedPhone);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      console.log(
        "Form Data to be sent for update:",
        Object.fromEntries(formData)
      );

      const result = await updatePartener({
        id: idPartener!,
        data: formData,
      }).unwrap();

      toast.success(result.message);
      console.log("API Response:", result);

      setTimeout(() => {
        navigate("/admins/partners");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating partner:", error);
      handleApiError(error, "update");
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneValue(value || "");
    setValue("contact_person_number", value || "");
  };

  const handleFileChange = (
    fieldName: keyof z.infer<typeof partenerSchema>,
    file: File
  ) => {
    setValue(fieldName, file as any);
  };

  const removeFile = (fieldName: keyof z.infer<typeof partenerSchema>) => {
    // في وضع التعديل، أرسل null لحذف الملف
    if (isEditMode) {
      setValue(fieldName, null as any);
      toast.info(`File marked for deletion. Save changes to confirm.`);
    } else {
      setValue(fieldName, null as any);
    }

    const refs = {
      logo_url: logoRef,
      cr_document_url: crDocRef,
      vat_document_url: vatDocRef,
      moh_document_url: mohDocRef,
      agreement_document_url: agreementDocRef,
      other_document_url: otherDocRef,
    };

    const currentRef = refs[fieldName as keyof typeof refs];
    if (currentRef?.current) {
      currentRef.current.value = "";
    }
  };

  const renderFileUpload = (
    fieldName: keyof z.infer<typeof partenerSchema>,
    label: string,
    ref: RefObject<HTMLInputElement | null>,
    currentFile: File | null,
    accept: string = "image/*,.pdf,.doc,.docx"
  ) => {
    const existingFileUrl = isEditMode
      ? (partnerResponse?.data?.[fieldName as keyof Partner] as string)
      : null;
    const hasExistingFile =
      existingFileUrl &&
      !existingFileUrl.includes("undefined") &&
      !existingFileUrl.includes("null") &&
      existingFileUrl.trim() !== "";

    const isFileDeleted = watch(fieldName) === null;

    const getFileType = (url: string) => {
      if (!url) return "unknown";
      const extension = url.split(".").pop()?.toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
      ) {
        return "image";
      } else if (extension === "pdf") {
        return "pdf";
      } else if (["doc", "docx"].includes(extension || "")) {
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
          {label}
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
                setValue(fieldName, undefined as any);
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
                    alt={label}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
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
              {existingFileType === "image" ? (
                <Button
                  type="button"
                  onClick={() => {
                    window.open(existingFileUrl, "_blank");
                  }}
                  variant={"ghost"}
                  size={"icon-sm"}
                >
                  <FiCheckCircle className="h-4 w-4" />
                  View Image
                </Button>
              ) : (
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => window.open(existingFileUrl, "_blank")}
                  className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded hover:bg-green-50 transition-colors"
                >
                  <FiCheckCircle className="h-4 w-4" />
                  View Document
                </Button>
              )}

              {/* زر التحميل */}
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = existingFileUrl;
                  link.download = `${label
                    .toLowerCase()
                    .replace(" ", "_")}.${existingFileUrl.split(".").pop()}`;
                  link.click();
                }}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-1 rounded hover:bg-purple-50 transition-colors"
              >
                <FiDownload className="h-4 w-4" />
                Download
              </Button>

              {/* زر الحذف */}
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => removeFile(fieldName)}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <FiX className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* منطقة رفع الملف */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300 bg-gray-50/50 hover:bg-blue-50/50">
          <input
            type="file"
            ref={ref}
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // التحقق من حجم الملف (10MB كحد أقصى)
                if (file.size > 10 * 1024 * 1024) {
                  toast.error("File size must be less than 10MB");
                  return;
                }
                handleFileChange(fieldName, file);
              }
            }}
          />

          {!currentFile && !isFileDeleted ? (
            <div
              className="cursor-pointer group"
              onClick={() => ref.current?.click()}
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
                {/* معاينة الملف الجديد إذا كان صورة */}
                {currentFile.type.startsWith("image/") ? (
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
                        : currentFile.type.includes("word")
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {currentFile.type === "application/pdf" ? (
                      <FiFileText className="h-6 w-6" />
                    ) : currentFile.type.includes("word") ? (
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
                      {currentFile.type.split("/")[1] || "file"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* معاينة الملف الجديد إذا كان صورة */}
                {currentFile.type.startsWith("image/") && (
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
                  onClick={() => removeFile(fieldName)}
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

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      reset();
      navigate("/admins/partners");
    }
  };

  const isLoading =
    isCreating || isUpdating || isSubmitting || (isEditMode && isLoadingSingle);
  const onSubmit = isEditMode ? handleEditPartener : handleAddPartener;

  return (
    <section className="mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/admins/partners")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Partner" : "Add New Partner"}
          </h1>
        </div>
        <p className="text-gray-600 flex items-center gap-2">
          <FiBriefcase className="text-blue-500" />
          {isEditMode
            ? "Update partner information and documents"
            : "Create a new partner account with all necessary information"}
        </p>
      </div>

      {isEditMode && isLoadingSingle && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-800">Loading partner data...</p>
          </div>
        </div>
      )}

      <form className="space-y-6" dir="ltr" onSubmit={handleSubmit(onSubmit)}>
        {/* Logo Upload - At the top */}
        <div className="bg-linear-to-br from-white to-blue-50 rounded-2xl shadow-sm border border-blue-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiImage className="text-blue-600" />
            Partner Logo
          </h3>
          {renderFileUpload(
            "logo_url",
            "Upload Company Logo",
            logoRef,
            logoFile,
            "image/*"
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiUser className="text-blue-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Partner Name (English)*"
              placeholder="Enter partner name (English)"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
              icon={<FiBriefcase />}
            />
            <Input
              label="Partner Name (Arabic)*"
              placeholder="أدخل اسم الشريك (عربي)"
              {...register("name_locale")}
              error={!!errors.name_locale}
              helperText={errors.name_locale?.message}
              disabled={isLoading}
              icon={<FiBriefcase />}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiMail className="text-blue-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Contact Person Name *"
              placeholder="Enter contact person name"
              {...register("contact_person_name")}
              error={!!errors.contact_person_name}
              helperText={errors.contact_person_name?.message}
              disabled={isLoading}
              icon={<FiUser />}
            />
            <Input
              label="Contact Person Email*"
              placeholder="Enter contact person email"
              {...register("contact_person_email")}
              error={!!errors.contact_person_email}
              helperText={errors.contact_person_email?.message}
              type="email"
              disabled={isLoading}
              icon={<FiMail />}
            />
          </div>

          <div className="mt-6" dir="ltr">
            <label className="font-bold text-gray-800  mb-3 flex items-center gap-2">
              <FiPhone className="text-blue-600" />
              Phone Number *
            </label>
            <div className="relative">
              <Controller
                name="contact_person_number"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    international
                    defaultCountry="SA"
                    countries={["SA", "EG"]}
                    placeholder="Enter phone number"
                    countryCallingCodeEditable={false}
                    value={field.value}
                    onChange={handlePhoneChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                )}
              />
              <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.contact_person_number && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                {errors.contact_person_number.message}
              </p>
            )}
          </div>

          <div className="mt-6">
            <Input
              label={
                isEditMode
                  ? "New Password (leave empty to keep current)"
                  : "Password*"
              }
              placeholder={isEditMode ? "Enter new password" : "Enter password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              type="password"
              disabled={isLoading}
              icon={<FiCheckCircle />}
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiMapPin className="text-blue-600" />
            Location Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Country *"
              placeholder="Select country"
              {...register("country_id")}
              error={!!errors.country_id}
              helperText={errors.country_id?.message}
              options={countries.map((country: any) => ({
                value: country.id,
                label: country.name,
              }))}
              disabled={isLoading || countriesLoading}
            />
            <Select
              label="City *"
              placeholder="Select city"
              {...register("city_id")}
              error={!!errors.city_id}
              helperText={errors.city_id?.message}
              options={cities.map((city: any) => ({
                value: city.id,
                label: city.name,
              }))}
              disabled={isLoading || citiesLoading}
            />
            <Input
              label="Address *"
              placeholder="Enter address"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              disabled={isLoading}
              icon={<FiHome />}
            />
            <Input
              label="Location *"
              placeholder="Enter location"
              {...register("location")}
              error={!!errors.location}
              helperText={errors.location?.message}
              disabled={isLoading}
              icon={<FiMapPin />}
            />
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiDollarSign className="text-blue-600" />
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="CR Number *"
              placeholder="Enter CR number"
              {...register("cr_number")}
              error={!!errors.cr_number}
              helperText={errors.cr_number?.message}
              disabled={isLoading}
              icon={<FiFileText />}
            />
            <Input
              label="VAT Number"
              placeholder="Enter VAT number"
              {...register("vat_number")}
              error={!!errors.vat_number}
              helperText={errors.vat_number?.message}
              disabled={isLoading}
              icon={<FiDollarSign />}
            />
            <Input
              label="MOH Number"
              placeholder="Enter MOH number"
              {...register("moh_number")}
              error={!!errors.moh_number}
              helperText={errors.moh_number?.message}
              disabled={isLoading}
              icon={<FiFileText />}
            />
            <Select
              label="Status *"
              placeholder="Select status"
              {...register("status")}
              error={!!errors.status}
              helperText={errors.status?.message}
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Documents Upload */}
        <div className="bg-linear-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-purple-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FiFileText className="text-purple-600" />
            Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFileUpload(
              "cr_document_url",
              "CR Document",
              crDocRef,
              crDocFile
            )}
            {renderFileUpload(
              "vat_document_url",
              "VAT Document",
              vatDocRef,
              vatDocFile
            )}
            {renderFileUpload(
              "moh_document_url",
              "MOH Document",
              mohDocRef,
              mohDocFile
            )}
            {renderFileUpload(
              "agreement_document_url",
              "Agreement Document",
              agreementDocRef,
              agreementDocFile
            )}
            {renderFileUpload(
              "other_document_url",
              "Other Documents",
              otherDocRef,
              otherDocFile
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            onClick={handleCancel}
            isloading={isLoading}
            variant="outline"
          >
            <FiX className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" isloading={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditMode ? "Updating Partner..." : "Creating Partner..."}
              </>
            ) : (
              <>
                <FiSave className="h-4 w-4" />
                {isEditMode ? "Update Partner" : "Create Partner"}
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddNewPartener;
