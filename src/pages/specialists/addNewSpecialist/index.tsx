// components/AddNewSpecialist.tsx
import React, {
  useMemo,
  useRef,
  useState,
  type RefObject,
  useEffect,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetPartenersQuery } from "../../../app/Api/Slices/partenersApiSlice";
import { customStyles, type OptionType, type Partner } from "../../../types";
import {
  FiBriefcase,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiImage,
  FiUpload,
  FiX,
  FiUser,
  FiMapPin,
  FiGlobe,
  FiCalendar,
  FiPhone,
  FiMail,
  FiLock,
  FiNavigation,
  FiMap,
  FiLink,
} from "react-icons/fi";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import { useGerBranchByPartnerQuery } from "../../../app/Api/Slices/BranchesApiSlice";
import {
  getSpecialistSchema,
  type SpecialistFormData,
} from "../../../validation/specialist";
import Button from "../../../components/ui/Button";
import { toast } from "react-toastify";
import { useGetCityQuery } from "../../../app/Api/Slices/CityApiSlice";
import Input from "../../../components/ui/Input";
import {
  useAddSpecialistMutation,
  useGetSpecialistsByIdQuery,
  useUpdateSpecialistMutation,
} from "../../../app/Api/Slices/specialistApiSlice";
import { extractCoordinatesFromLink } from "../../../utils/locationUtils";

const defaultSpecialistValues: SpecialistFormData = {
  partner_id: "",
  medical_branch_id: "",
  name: "",
  title: "",
  id_Number: "",
  date_of_birth: "",
  gender: "",
  tracking_link: "",
  mobile: "",
  nationality: "",
  email: "",
  password: "",
  location_link: "",
  description: "",
  description_locale: "",
  city_id: "",
  logo_url: undefined,
  id_document: undefined,
};

// خيارات الجنس
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const AddNewSpecialist = () => {
  const navigate = useNavigate();
  const params = useParams();
  const idSpecialist = params.id;
  console.log("idSpecialist", idSpecialist);
  const isEditMode = Boolean(idSpecialist);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");

  const logoRef = useRef<HTMLInputElement>(null);
  const idDocumentRef = useRef<HTMLInputElement>(null);

  // الـ API mutations
  const [addSpecialist, { isLoading: isAdding }] = useAddSpecialistMutation();
  const [updateSpecialist, { isLoading: isUpdating }] =
    useUpdateSpecialistMutation();

  // جلب بيانات الطبيب في وضع التعديل
  const { data: specialistData, isLoading: isLoadingSpecialist } =
    useGetSpecialistsByIdQuery(idSpecialist!, { skip: !isEditMode });

  const [extractedCoords, setExtractedCoords] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SpecialistFormData>({
    resolver: zodResolver(getSpecialistSchema(isEditMode) as any),
    defaultValues: defaultSpecialistValues,
  });

  // مشاهدة قيم الحقول المهمة
  const selectedPartnerId = watch("partner_id");
  const logoFile = watch("logo_url");
  const idDocumentFile = watch("id_document");
  const locationLink = watch("location_link");

  // جلب البيانات من الـ APIs
  const { data: partnersData, isLoading: partnersLoading } =
    useGetPartenersQuery({
      page,
      limit: perPage,
    });
  const { data: citiesData, isLoading: citiesLoading } = useGetCityQuery({});

  const cities = citiesData?.data || [];

  // جلب الـ branches بناءً على الـ partner المختار
  const { data: branchesData, isLoading: branchesLoading } =
    useGerBranchByPartnerQuery(
      selectedPartnerId ? Number(selectedPartnerId) : 0,
      { skip: !selectedPartnerId }
    );

  const partners: Partner[] = partnersData?.data || [];
  const branches = branchesData?.data || [];

  // تحميل بيانات الطبيب في وضع التعديل
  useEffect(() => {
    if (isEditMode && specialistData?.data) {
      const specialist = specialistData.data;

      // إنشاء location link من الإحداثيات الموجودة
      const locationLink =
        specialist.Latitude && specialist.Longitude
          ? `https://maps.google.com/?q=${specialist.Latitude},${specialist.Longitude}`
          : "";

      reset({
        ...specialist,
        partner_id: String(specialist.partner_id || ""),
        medical_branch_id: String(specialist.medical_branch_id || ""),
        city_id: String(specialist.city_id || ""),
        date_of_birth: specialist.date_of_birth
          ? new Date(specialist.date_of_birth).toISOString().split("T")[0]
          : "",
        location_link: locationLink,
        password: "", // لا تحمل كلمة المرور
      });

      // تعيين الإحداثيات المستخرجة
      if (specialist.Latitude && specialist.Longitude) {
        setExtractedCoords({
          latitude: String(specialist.Latitude),
          longitude: String(specialist.Longitude),
        });
      }
    }
  }, [isEditMode, specialistData, reset]);

  // استخراج الإحداثيات عند تغيير اللينك
  useEffect(() => {
    if (locationLink) {
      const coords = extractCoordinatesFromLink(locationLink);
      setExtractedCoords(coords);

      if (!coords) {
        toast.warning("Unable to extract coordinates from the provided link");
      }
    } else {
      setExtractedCoords(null);
    }
  }, [locationLink]);

  // تحويل البيانات إلى options
  const partnerOptions: OptionType[] = useMemo(
    () =>
      partners.map((p) => ({
        value: String(p.id),
        label: p.name,
        partner: p,
        logo: p.logo_url ?? null,
      })),
    [partners]
  );

  const branchOptions: OptionType[] = useMemo(
    () =>
      branches.map((branch: any) => ({
        value: String(branch.id),
        label: branch.name,
        logo: branch.logo_url ?? null,
      })),
    [branches]
  );

  const cityOptions = useMemo(
    () =>
      cities.map((city: any) => ({
        value: String(city.id),
        label: city.name,
      })),
    [cities]
  );

  // معالجة تغيير الـ partner
  const handlePartnerChange = (opt: OptionType | null) => {
    if (opt) {
      setValue("partner_id", opt.value, { shouldValidate: true });
    } else {
      setValue("partner_id", "", { shouldValidate: true });
      setValue("medical_branch_id", "", { shouldValidate: true });
    }
  };

  // معالجة تغيير الـ branch
  const handleBranchChange = (opt: OptionType | null) => {
    if (opt) {
      setValue("medical_branch_id", opt.value, { shouldValidate: true });
    } else {
      setValue("medical_branch_id", "", { shouldValidate: true });
    }
  };

  // معالجة رفع الملفات
  const handleFileChange = (
    fieldName: keyof SpecialistFormData,
    file: File
  ) => {
    setValue(fieldName, file as any, { shouldValidate: true });
  };

  // معالجة حذف الملفات
  const removeFile = (fieldName: keyof SpecialistFormData) => {
    if (isEditMode) {
      setValue(fieldName, null as any, { shouldValidate: true });
      toast.info(`File marked for deletion. Save changes to confirm.`);
    } else {
      setValue(fieldName, undefined as any, { shouldValidate: true });
    }

    const refs = {
      logo_url: logoRef,
      id_document: idDocumentRef,
    };

    const currentRef = refs[fieldName as keyof typeof refs];
    if (currentRef?.current) {
      currentRef.current.value = "";
    }
  };

  // إرسال النموذج
  const onSubmit = async (formData: SpecialistFormData) => {
    try {
      console.log("🔄 Frontend - Starting form submission with files:", {
        logo_url: formData.logo_url,
        id_document: formData.id_document,
      });

      // استخراج الإحداثيات من اللينك
      const coords = extractCoordinatesFromLink(formData.location_link);

      if (!coords) {
        toast.error("Please provide a valid location link with coordinates");
        return;
      }

      // إنشاء FormData بدلاً من إرسال JSON
      const formDataToSend = new FormData();

      // إعداد البيانات للإرسال مع مراعاة وضع التعديل
      const fieldsToSend: any = {
        name: formData.name,
        email: formData.email,
        title: formData.title,
        id_Number: formData.id_Number,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        tracking_link: formData.tracking_link,
        mobile: formData.mobile,
        nationality: formData.nationality,
        description: formData.description,
        description_locale: formData.description_locale,
        location_link: formData.location_link,
        Latitude: coords.latitude,
        Longitude: coords.longitude,
      };

      // في وضع التعديل، الحقول التالية اختيارية
      if (isEditMode) {
        // إضافة الحقول الاختيارية فقط إذا كانت موجودة
        if (formData.partner_id) fieldsToSend.partner_id = formData.partner_id;
        if (formData.medical_branch_id)
          fieldsToSend.medical_branch_id = formData.medical_branch_id;
        if (formData.city_id) fieldsToSend.city_id = formData.city_id;
        if (formData.password) fieldsToSend.password = formData.password;
      } else {
        // في وضع الإنشاء، جميع الحقول مطلوبة
        fieldsToSend.partner_id = formData.partner_id;
        fieldsToSend.medical_branch_id = formData.medical_branch_id;
        fieldsToSend.city_id = formData.city_id;
        fieldsToSend.password = formData.password;
      }

      // إضافة الحقول النصية إلى FormData
      Object.keys(fieldsToSend).forEach((key) => {
        if (
          fieldsToSend[key] !== null &&
          fieldsToSend[key] !== undefined &&
          fieldsToSend[key] !== ""
        ) {
          console.log(
            `📤 Adding field to FormData: ${key} = ${fieldsToSend[key]}`
          );
          formDataToSend.append(key, String(fieldsToSend[key]));
        }
      });

      // إضافة الملفات إلى FormData
      if (formData.logo_url instanceof File) {
        console.log("📤 Adding logo file to FormData:", formData.logo_url.name);
        formDataToSend.append("logo_url", formData.logo_url);
      } else if (formData.logo_url === null && isEditMode) {
        console.log("📤 Marking logo for deletion");
        formDataToSend.append("logo_url", "");
      }

      if (formData.id_document instanceof File) {
        console.log(
          "📤 Adding ID document to FormData:",
          formData.id_document.name
        );
        formDataToSend.append("id_document", formData.id_document);
      } else if (formData.id_document === null && isEditMode) {
        console.log("📤 Marking ID document for deletion");
        formDataToSend.append("id_document", "");
      }

      // طباعة محتويات FormData للتأكد
      console.log("📤 FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(
          `  ${key}:`,
          value instanceof File ? `File: ${value.name}` : value
        );
      }

      if (isEditMode) {
        console.log("🔄 Calling update API with FormData...");
        await updateSpecialist({
          id: idSpecialist!,
          data: formDataToSend,
        }).unwrap();
        toast.success("Specialist updated successfully");
      } else {
        await addSpecialist(formDataToSend).unwrap();
        toast.success("Specialist created successfully");
      }

      navigate("/admins/specialists");
    } catch (error: any) {
      console.error("❌ Error submitting form:", error);
      toast.error(
        error?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} specialist`
      );
    }
  };

  // دالة عرض رفع الملفات
  const renderFileUpload = (
    fieldName: keyof SpecialistFormData,
    label: string,
    ref: RefObject<HTMLInputElement | null>,
    currentFile: File | null | undefined,
    accept: string = "image/*,.pdf,.doc,.docx"
  ) => {
    const existingFileUrl = isEditMode
      ? (specialistData?.data?.[
          fieldName as keyof typeof specialistData.data
        ] as string)
      : null;

    const hasExistingFile =
      existingFileUrl &&
      existingFileUrl !== "null" &&
      existingFileUrl !== "undefined" &&
      existingFileUrl.trim() !== "";

    const isFileDeleted = watch(fieldName) === null;

    const getFileType = (url: string) => {
      if (!url) return "unknown";
      const extension = url?.split(".").pop()?.toLowerCase();
      if (
        ["jpg", "jpeg", "png", "gif", "webp", "svg"]?.includes(extension || "")
      ) {
        return "image";
      } else if (extension === "pdf") {
        return "pdf";
      } else if (["doc", "docx"]?.includes(extension || "")) {
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
                  link.download = `${label
                    .toLowerCase()
                    .replace(" ", "_")}.${existingFileUrl?.split(".").pop()}`;
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
                onClick={() => removeFile(fieldName)}
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
            ref={ref}
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
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

  const isLoading = isAdding || isUpdating || isLoadingSpecialist;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Specialist" : "Add New Specialist"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update specialist information and details"
            : "Create a new specialist with the form below"}
        </p>
      </div>

      <form className="space-y-6" dir="ltr" onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBriefcase className="text-blue-600" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Partner */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Select Partner {!isEditMode && "*"}
                {isEditMode && (
                  <span className="text-gray-400 text-sm ml-1">(Optional)</span>
                )}
              </label>
              <Controller
                control={control}
                name="partner_id"
                render={({ field }) => (
                  <PartnerSelect
                    options={partnerOptions}
                    isLoading={partnersLoading}
                    onChange={(opt) => {
                      handlePartnerChange(opt);
                      field.onChange(opt ? opt.value : "");
                    }}
                    value={
                      partnerOptions.find((o) => o.value === field.value) ??
                      null
                    }
                  />
                )}
              />
              {errors.partner_id && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.partner_id.message}
                </p>
              )}
            </div>

            {/* Select Branch */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Select Branch {!isEditMode && "*"}
                {isEditMode && (
                  <span className="text-gray-400 text-sm ml-1">(Optional)</span>
                )}
              </label>
              <Controller
                control={control}
                name="medical_branch_id"
                render={({ field }) => (
                  <BranchSelect
                    options={branchOptions}
                    isLoading={branchesLoading}
                    isDisabled={!selectedPartnerId}
                    onChange={(opt) => {
                      handleBranchChange(opt);
                      field.onChange(opt ? opt.value : "");
                    }}
                    value={
                      branchOptions.find((o) => o.value === field.value) ?? null
                    }
                    placeholder={
                      !selectedPartnerId
                        ? "Please select partner first"
                        : branchesLoading
                        ? "Loading branches..."
                        : "Select Branch"
                    }
                  />
                )}
              />
              {errors.medical_branch_id && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.medical_branch_id.message}
                </p>
              )}
            </div>

            {/* Name */}
            <Input
              label="Name *"
              placeholder="Enter specialist name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
              icon={<FiUser />}
            />

            {/* Title */}
            <Input
              label="Title *"
              placeholder="Enter specialist title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isLoading}
              icon={<FiBriefcase />}
            />

            {/* Email */}
            <Input
              label="Email *"
              placeholder="Enter email address"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              icon={<FiMail />}
            />

            {/* Password */}
            {/* Password - اختياري في التعديل */}
            <Input
              label={isEditMode ? "New Password (optional)" : "Password *"}
              placeholder={
                isEditMode ? "Enter new password to change" : "Enter password"
              }
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              type="password"
              disabled={isLoading}
              icon={<FiLock />}
            />

            {/* Select City */}
            <div>
              <label className="font-bold text-gray-700 mb-1 flex items-center gap-2">
                <FiMapPin className="text-blue-600" />
                City {!isEditMode && "*"}
                {isEditMode && (
                  <span className="text-gray-400 text-sm">(Optional)</span>
                )}
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
                    onChange={(opt) => field.onChange(opt ? opt.value : "")}
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

            {/* Gender Select */}
            <div>
              <label className="font-bold text-gray-700  mb-1 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Gender *
              </label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select<{ value: string; label: string }>
                    options={genderOptions}
                    value={
                      genderOptions.find((o) => o.value === field.value) ?? null
                    }
                    onChange={(opt) => field.onChange(opt ? opt.value : "")}
                    placeholder="Select gender"
                    styles={customStyles}
                    isDisabled={isLoading}
                  />
                )}
              />
              {errors.gender && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.gender?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiUser className="text-blue-600" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Number */}
            <Input
              label="ID Number *"
              placeholder="Enter ID number"
              {...register("id_Number")}
              error={!!errors.id_Number}
              helperText={errors.id_Number?.message}
              disabled={isLoading}
              icon={<FiFileText />}
            />

            {/* Date of Birth */}
            <Input
              label="Date of Birth *"
              placeholder="Select date of birth"
              type="date"
              {...register("date_of_birth")}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth?.message}
              disabled={isLoading}
              icon={<FiCalendar />}
            />

            {/* Mobile */}
            <Input
              label="Mobile Number *"
              placeholder="Enter mobile number"
              {...register("mobile")}
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
              disabled={isLoading}
              icon={<FiPhone />}
            />

            {/* Nationality */}
            <Input
              label="Nationality *"
              placeholder="Enter nationality"
              {...register("nationality")}
              error={!!errors.nationality}
              helperText={errors.nationality?.message}
              disabled={isLoading}
              icon={<FiGlobe />}
            />

            {/* Tracking Link */}
            <Input
              label="Tracking Link *"
              placeholder="Enter tracking link"
              {...register("tracking_link")}
              error={!!errors.tracking_link}
              helperText={errors.tracking_link?.message}
              disabled={isLoading}
              icon={<FiNavigation />}
            />
          </div>
        </div>

        {/* Location Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiMap className="text-blue-600" />
            Location Information
          </h2>

          <div className="space-y-6">
            {/* Location Link Input */}
            <div>
              <label className="font-bold text-gray-700  mb-2 flex items-center gap-2">
                <FiLink className="text-blue-600" />
                Location Link *
              </label>
              <Input
                placeholder="Paste Google Maps link or coordinates (lat,lng)"
                {...register("location_link")}
                error={!!errors.location_link}
                helperText={
                  errors.location_link?.message ||
                  "Paste a Google Maps link or coordinates like: 31.2001,29.9187"
                }
                disabled={isLoading}
                icon={<FiMap />}
              />

              {/* أمثلة للروابط المقبولة */}
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Accepted formats:
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• https://maps.google.com/?q=31.2001,29.9187</li>
                  <li>• https://www.google.com/maps/@31.2001,29.9187</li>
                  <li>• 31.2001,29.9187</li>
                </ul>
              </div>
            </div>

            {/* Extracted Coordinates Display */}
            {extractedCoords && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <FiCheckCircle className="h-4 w-4" />
                  Coordinates Extracted Successfully
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Latitude:</span>
                    <span className="ml-2 text-green-600 font-mono">
                      {extractedCoords.latitude}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Longitude:
                    </span>
                    <span className="ml-2 text-green-600 font-mono">
                      {extractedCoords.longitude}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {locationLink && !extractedCoords && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <FiX className="h-4 w-4" />
                  Unable to Extract Coordinates
                </h3>
                <p className="text-sm text-yellow-700">
                  Please make sure the link contains valid coordinates.
                  Supported formats: Google Maps links or direct coordinates.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiFileText className="text-blue-600" />
            Description
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Description (English) */}
            <div>
              <label className="font-bold text-gray-700 block mb-2">
                Description (English) *
              </label>
              <textarea
                {...register("description")}
                placeholder="Enter description in English"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={4}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description?.message}
                </p>
              )}
            </div>

            {/* Description (Arabic) */}
            <div>
              <label className="font-bold text-gray-700 block mb-2">
                Description (Arabic) *
              </label>
              <textarea
                {...register("description_locale")}
                placeholder="أدخل الوصف باللغة العربية"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={4}
                dir="rtl"
                disabled={isLoading}
              />
              {errors.description_locale && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description_locale?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiImage className="text-blue-600" />
            Files & Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFileUpload(
              "logo_url",
              "Specialist Logo",
              logoRef,
              logoFile,
              "image/*"
            )}

            {renderFileUpload(
              "id_document",
              "ID Document",
              idDocumentRef,
              idDocumentFile,
              "image/*,.pdf,.doc,.docx"
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant={"outline"}
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" isloading={isLoading || isSubmitting}>
            {isLoading ? "Saving..." : isEditMode ? "Update" : "Create"}{" "}
            Specialist
          </Button>
        </div>
      </form>
    </div>
  );
};

// مكونات الـ Select المخصصة
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

const PartnerSelect: React.FC<{
  options: OptionType[];
  isLoading?: boolean;
  value?: OptionType | null;
  onChange: (opt: OptionType | null) => void;
}> = ({ options, isLoading, onChange, value }) => {
  return (
    <Select
      options={options}
      isLoading={isLoading}
      isClearable
      placeholder="Select Partner"
      onChange={(v) => onChange(v as OptionType | null)}
      components={{ Option, SingleValue }}
      styles={customStyles}
      value={value ?? null}
    />
  );
};

const BranchSelect: React.FC<{
  options: OptionType[];
  isLoading?: boolean;
  isDisabled?: boolean;
  value?: OptionType | null;
  onChange: (opt: OptionType | null) => void;
  placeholder?: string;
}> = ({
  options,
  isLoading,
  isDisabled,
  onChange,
  value,
  placeholder = "Select Branch",
}) => {
  return (
    <Select
      options={options}
      isLoading={isLoading}
      isClearable
      isDisabled={isDisabled}
      placeholder={placeholder}
      onChange={(v) => onChange(v as OptionType | null)}
      components={{ Option, SingleValue }}
      styles={customStyles}
      value={value ?? null}
    />
  );
};

export default AddNewSpecialist;
