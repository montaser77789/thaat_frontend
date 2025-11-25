import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCatagorySchema,
  type catagorychemaFormData,
} from "../../../validation/catagory";
import {
  useCreateCatagoryMutation,
  useGetCatagoryByIdQuery,
  useUpdateCatagoryMutation,
} from "../../../app/Api/Slices/catagoryApiSlice";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import {
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiUpload,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";

const AddNewCatagory = () => {
  const navigate = useNavigate();
  const params = useParams();
  const idCatagory = params.id;
  const isEditMode = Boolean(idCatagory);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<catagorychemaFormData>({
    resolver: zodResolver(getCatagorySchema(isEditMode) as any),
    defaultValues: {
      name_ar: "",
      name_en: "",
      file: undefined,
    },
  });

  const [createCatagory, { isLoading: isCreating }] =
    useCreateCatagoryMutation();
  const [updateCatagory, { isLoading: isUpdating }] =
    useUpdateCatagoryMutation();
  const { data: catagoryData, isLoading: isLoadingData } =
    useGetCatagoryByIdQuery(idCatagory!, {
      skip: !isEditMode,
    });
  console.log(catagoryData);
  // تحميل البيانات في وضع التعديل
  useEffect(() => {
    if (isEditMode && catagoryData) {
      reset({
        name_ar: catagoryData.data?.name_ar || "",
        name_en: catagoryData.data?.name_en || "",
        file: catagoryData.data?.file || "",
      });
    }
  }, [isEditMode, catagoryData, reset]);

  const fileRef = useRef<HTMLInputElement>(null);
  const fileValue = watch("file");

  // دالة مساعدة للتحقق من نوع fileValue
  const getCurrentFile = (): File | null | undefined => {
    if (fileValue instanceof File) {
      return fileValue;
    }
    return undefined;
  };

  const onSubmit = async (data: catagorychemaFormData) => {
    try {
      const formData = new FormData();

      // إضافة الحقول النصية
      formData.append("name_ar", data.name_ar);
      formData.append("name_en", data.name_en);

      // معالجة الملف
      if (data.file instanceof File) {
        formData.append("file", data.file);
      } else if (data.file === null && isEditMode) {
        // في حالة حذف الملف في وضع التعديل
        formData.append("file", "");
      } else if (data.file && typeof data.file === "string" && isEditMode) {
        // الحفاظ على الملف الحالي إذا لم يتم تغييره
        formData.append("file", data.file);
      }

      if (isEditMode && idCatagory) {
        // تحديث الكاتيجوري
        const res = await updateCatagory({
          id: idCatagory,
          data: formData,
        }).unwrap();
        toast.success(res.message);
      } else {
        // إنشاء كاتيجوري جديد
        const res = await createCatagory(formData).unwrap();
        toast.success(res.message);
      }

      navigate("/admins/categories"); // تغيير المسار حسب مسار قائمة الكاتيجوريات
    } catch (error: any) {
      console.error("Error submitting category:", error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const isLoading = isCreating || isUpdating || isSubmitting || isLoadingData;

  const removeFile = (fieldName: keyof catagorychemaFormData) => {
    if (isEditMode) {
      setValue(fieldName, null as any, { shouldValidate: true });
      toast.info(`File marked for deletion. Save changes to confirm.`);
    } else {
      setValue(fieldName, undefined as any, { shouldValidate: true });
    }

    const refs = {
      file: fileRef,
    };

    const currentRef = refs[fieldName as keyof typeof refs];
    if (currentRef?.current) {
      currentRef.current.value = "";
    }
  };

  // معالجة رفع الملفات
  const handleFileChange = (
    fieldName: keyof catagorychemaFormData,
    file: File
  ) => {
    setValue(fieldName, file as any, { shouldValidate: true });
  };

  // دالة عرض رفع الملفات
  const renderFileUpload = (
    fieldName: keyof catagorychemaFormData,
    label: string,
    ref: RefObject<HTMLInputElement | null>,
    currentFile: File | null | undefined,
    accept: string = "image/*,.pdf,.doc,.docx"
  ) => {
    const existingFileUrl = isEditMode
      ? (catagoryData?.data?.[
          fieldName as keyof typeof catagoryData.data
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
                    onError={(e) => {
                      // معالجة خطأ تحميل الصورة
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Category" : "Add New Category"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update category information and details"
            : "Create a new category with the form below"}
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Category Name Arabic *"
                placeholder="Category Name Arabic"
                {...register("name_ar")}
                error={!!errors.name_ar}
                helperText={errors.name_ar?.message}
                disabled={isLoading}
              />
              <Input
                label="Category Name (English) *"
                placeholder="Category Name (English)"
                {...register("name_en")}
                error={!!errors.name_en}
                helperText={errors.name_en?.message}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              {renderFileUpload(
                "file",
                "Category Logo",
                fileRef,
                getCurrentFile(), // استخدام الدالة المساعدة هنا
                "image/*"
              )}
              {errors.file && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.file.message}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              isloading={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isloading={isLoading} className="min-w-32">
              {isEditMode ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewCatagory;