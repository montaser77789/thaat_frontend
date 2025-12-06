import React, { useEffect, useMemo } from "react";
import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
  type StylesConfig,
  type MultiValueProps,
} from "react-select";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetPartenersQuery } from "../../../app/Api/Slices/partenersApiSlice";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetCityQuery } from "../../../app/Api/Slices/CityApiSlice";
import Input from "../../../components/ui/Input";
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import Button from "../../../components/ui/Button";
import {
  branchSchema,
  defaultBranchValues,
  type BranchFormData,
} from "../../../validation/branches";
import {
  useCreateBranchMutation,
  useGetBranchByIdQuery,
  useUpdateBranchMutation,
} from "../../../app/Api/Slices/BranchesApiSlice";
import { toast } from "react-toastify";
import {
  customStyles,
  type City,
  type OptionType,
  type Partner,
} from "../../../types";
import { useGetCatagoresQuery } from "../../../app/Api/Slices/catagoryApiSlice";

// تعريف نوع الكاتيجوري
type Category = {
  id: number;
  name_en: string;
  name_ar: string;
  file: string;
};

// تعريف نوع catagory من الـ response
type BranchCatagory = {
  branch_id: number;
  catagory_id: number;
  catagory: Category;
};

// تعريف نوع الـ Option للكاتيجوري
type CategoryOptionType = {
  value: string;
  label: string;
  category?: Category;
};

// تعريف ساعات العمل
type WorkingHours = {
  week_days: string[];
  start_time: string;
  end_time: string;
};

// تعريف بيانات الفرع من الـ API بناءً على الـ response
type BranchResponse = {
  id: number;
  name: string;
  name_locale: string;
  contact_person_name: string;
  contact_person_number: string;
  contact_person_email: string;
  password: string;
  address: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  mobile: string;
  email: string;
  status: string;
  partner_id: number;
  city_id: number;
  created_at: string;
  updated_at: string;
  partner: Partner;
  city: City;
  working_hours_per_day: any[];
  branch_items: any[];
  catagories: BranchCatagory[];
};

// أنماط الـ Multi-select
const multiSelectStyles: StylesConfig<CategoryOptionType, true> = {
  control: (base) => ({ ...base, minHeight: 48, padding: 5, borderRadius: 6 }),
  option: (base) => ({ ...base, padding: 12 }),
  multiValue: (base) => ({ ...base, backgroundColor: "#e2e8f0" }),
};

// أيام الأسبوع
const WEEK_DAYS = [
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
];

// مكونات الـ Select المخصصة
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

// MultiValue مخصص للكاتيجوريات
const CategoryMultiValue = (props: MultiValueProps<CategoryOptionType>) => {
  return (
    <components.MultiValue {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span>{props.data.label}</span>
      </div>
    </components.MultiValue>
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

const AddNewBranch: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const idbranch = params.id;
  const isEditMode = Boolean(idbranch);

  const { data: branchResponse, isLoading: isLoadingSingle } =
    useGetBranchByIdQuery(idbranch, {
      skip: !isEditMode,
    });

  const [updateBranch] = useUpdateBranchMutation();
  const [createBranch] = useCreateBranchMutation();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("per_page") || "10");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema as any),
    defaultValues: defaultBranchValues,
  });

  // جلب البيانات من الـ APIs
  const { data: partnersData, isLoading: partnersLoading } =
    useGetPartenersQuery({
      page,
      limit: perPage,
    });
  const { data: citiesData, isLoading: citiesLoading } = useGetCityQuery({});
  const { data: catagoriesData, isLoading: catagoriesLoading } =
    useGetCatagoresQuery({});

  const partners: Partner[] = partnersData?.data || [];
  const cities: City[] = citiesData?.data || [];
  const categories: Category[] = catagoriesData?.data || [];

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

  const cityOptions = useMemo(
    () =>
      cities.map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    [cities]
  );
console.log("categories",catagoriesData)  
  // تحويل الكاتيجوريات إلى CategoryOptionType
  const categoryOptions: CategoryOptionType[] = useMemo(
    () =>
      categories.map((cat) => ({
        value: String(cat.id),
        label: cat.name_ar || cat.name_en,
        category: cat,
      })),
    [categories]
  );

  // تحميل البيانات في وضع التعديل
  useEffect(() => {
    if (isEditMode && branchResponse?.data) {
      const branchData: BranchResponse = branchResponse.data;

      console.log("Branch data for edit:", branchData);
      console.log("Categories data:", branchData.catagories);

      const formData: BranchFormData = {
        name: branchData.name || "",
        name_locale: branchData.name_locale || "",
        contact_person_name: branchData.contact_person_name || "",
        contact_person_number: branchData.contact_person_number || "",
        contact_person_email: branchData.contact_person_email || "",
        password: branchData.password || "",
        city_id: String(branchData.city_id) || "",
        address: branchData.address || "",
        latitude: branchData.latitude ? String(branchData.latitude) : "",
        longitude: branchData.longitude ? String(branchData.longitude) : "",
        location: branchData.location || "",
        partner_id: String(branchData.partner_id) || "",
        status: branchData.status || "ACTIVE",
        phone: branchData.phone || "",
        mobile: branchData.mobile || "",
        email: branchData.email || "",
        // تحويل catagories إلى array of IDs (strings)
        categories: (branchData.catagories || []).map((catItem) => 
          String(catItem.catagory.id)
        ),

        working_hours_per_day:
          (branchData.working_hours_per_day || []).map((wh: any) => ({
            week_days: wh.day ? [wh.day] : [],
            start_time: wh.start_time || "09:00",
            end_time: wh.end_time || "17:00",
          })),
      };

      console.log("Form data after mapping:", formData);
      reset(formData);
    }
  }, [isEditMode, branchResponse, reset]);

  // معالجة تغيير الـ partner
  const handlePartnerChange = (opt: OptionType | null) => {
    if (opt) setValue("partner_id", opt.value, { shouldValidate: true });
    else setValue("partner_id", "", { shouldValidate: true });
  };

  // معالجة تغيير الـ city
  const handleCityChange = (opt: OptionType | null) => {
    if (opt) setValue("city_id", opt.value, { shouldValidate: true });
    else setValue("city_id", "", { shouldValidate: true });
  };

  // معالجة تغيير الكاتيجوريات
  const handleCategoriesChange = (selectedOptions: CategoryOptionType[] | null) => {
    if (selectedOptions) {
      const categoryIds = selectedOptions.map((opt) => opt.value);
      setValue("categories", categoryIds, { shouldValidate: true });
    } else {
      setValue("categories", [], { shouldValidate: true });
    }
  };

  // إدارة ساعات العمل
  const workingHours = watch("working_hours_per_day") || [];

  const addWorkingHours = () => {
    const newHours: WorkingHours = {
      week_days: [],
      start_time: "09:00",
      end_time: "17:00",
    };
    setValue("working_hours_per_day", [...workingHours, newHours]);
  };

  const removeWorkingHours = (index: number) => {
    const updated = workingHours.filter((_, i) => i !== index);
    setValue("working_hours_per_day", updated);
  };

  const updateWorkingHours = (
    index: number,
    field: keyof WorkingHours,
    value: any
  ) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setValue("working_hours_per_day", updated);
  };

  // معالجة إرسال الفورم
  const onSubmit = async (formData: BranchFormData) => {
    try {
      console.log("Submitting branch data:", formData);

      // تحويل البيانات إلى التنسيق المطلوب في الـ backend
      const payload = {
        ...formData,
        partner_id: Number(formData.partner_id),
        city_id: Number(formData.city_id),
        status: formData.status,
        // تحويل array of strings إلى array of numbers
        categories: formData.categories.map((id) => Number(id)),
        working_hours_per_day: formData.working_hours_per_day.map((wh) => ({
          week_days: wh.week_days,
          start_time: wh.start_time,
          end_time: wh.end_time,
        })),
      };

      console.log("Payload for API:", payload);

      let res;
      if (isEditMode && idbranch) {
        // وضع التعديل
        res = await updateBranch({ id: idbranch, data: payload }).unwrap();
        toast.success(res.message || "Branch updated successfully");
      } else {
        // وضع الإضافة
        res = await createBranch(payload).unwrap();
        toast.success(res.message || "Branch created successfully");
        reset();
      }

      console.log("API Response:", res);
      navigate(`/admins/branches`);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  if (isEditMode && isLoadingSingle) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading branch data...</p>
        </div>
      </div>
    );
  }

  // الحصول على القيم المختارة للكاتيجوريات لعرضها في الـ Select
  const selectedCategories = watch("categories") || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* عنوان الصفحة */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Branch" : "Add New Branch"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update branch information and details"
            : "Create a new branch with the form below"}
        </p>
      </div>

      <form className="space-y-6" dir="ltr" onSubmit={handleSubmit(onSubmit)}>
        {/* معلومات الأساسية */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBriefcase className="text-blue-600" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Select Partner *
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

            <Input
              label="Branch Name (English) *"
              placeholder="Enter branch name (English)"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={partnersLoading}
            />

            <Input
              label="Branch Name (Local)"
              placeholder="Enter branch name in local language"
              {...register("name_locale")}
              error={!!errors.name_locale}
              helperText={errors.name_locale?.message}
            />

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Status
              </label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    options={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "INACTIVE", label: "Inactive" },
                    ]}
                    styles={customStyles}
                    value={
                      [
                        { value: "ACTIVE", label: "Active" },
                        { value: "INACTIVE", label: "Inactive" },
                      ].find((o) => o.value === field.value) ?? null
                    }
                    onChange={(v) => field.onChange(v ? (v as any).value : "")}
                  />
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                City *
              </label>
              <Controller
                control={control}
                name="city_id"
                render={({ field }) => (
                  <Select
                    options={cityOptions}
                    styles={customStyles}
                    isLoading={citiesLoading}
                    value={
                      cityOptions.find((o) => o.value === field.value) ?? null
                    }
                    onChange={(v) => {
                      const val = v ? (v as any).value : "";
                      field.onChange(val);
                      handleCityChange(v as OptionType | null);
                    }}
                  />
                )}
              />
              {errors.city_id && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.city_id.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* معلومات الاتصال */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Contact Person Name"
              placeholder="Contact person name"
              {...register("contact_person_name")}
              error={!!errors.contact_person_name}
              helperText={errors.contact_person_name?.message}
            />

            <Input
              label="Contact Person Number"
              placeholder="01012345678"
              {...register("contact_person_number")}
              error={!!errors.contact_person_number}
              helperText={errors.contact_person_number?.message}
            />

            <Input
              label="Contact Person Email"
              placeholder="email@example.com"
              {...register("contact_person_email")}
              error={!!errors.contact_person_email}
              helperText={errors.contact_person_email?.message}
            />

            <Input
              label="Phone"
              placeholder="Phone number"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <Input
              label="Mobile"
              placeholder="Mobile number"
              {...register("mobile")}
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
            />

            <Input
              label="Email"
              placeholder="branch@example.com"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </div>
        </div>

        {/* الموقع */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiMapPin className="text-green-600" />
            Location Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Address"
              placeholder="Full address"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <Input
              label="Latitude"
              placeholder="29.123456"
              type="number"
              step="any"
              {...register("latitude")}
              error={!!errors.latitude}
              helperText={errors.latitude?.message}
            />

            <Input
              label="Longitude"
              placeholder="31.123456"
              type="number"
              step="any"
              {...register("longitude")}
              error={!!errors.longitude}
              helperText={errors.longitude?.message}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Select Categories
              </label>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <Select<CategoryOptionType, true>
                    options={categoryOptions}
                    styles={multiSelectStyles}
                    isLoading={catagoriesLoading}
                    isMulti
                    // تحويل array of IDs إلى array of CategoryOptionType
                    value={categoryOptions.filter((opt) =>
                      selectedCategories.includes(opt.value)
                    )}
                    onChange={(v) => {
                      handleCategoriesChange(v as CategoryOptionType[] | null);
                      field.onChange(
                        v ? (v as CategoryOptionType[]).map((opt) => opt.value) : []
                      );
                    }}
                    components={{ MultiValue: CategoryMultiValue }}
                  />
                )}
              />
              {errors.categories && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.categories.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ساعات العمل */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FiClock className="text-orange-600" />
              Working Hours
            </h2>
            <Button
              type="button"
              onClick={addWorkingHours}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <FiPlus size={16} />
              Add Working Hours
            </Button>
          </div>

          {workingHours.map((wh, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg"
            >
              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  Days
                </label>
                <Controller
                  control={control}
                  name={`working_hours_per_day.${index}.week_days`}
                  render={({ field }) => (
                    <Select
                      options={WEEK_DAYS}
                      styles={multiSelectStyles}
                      isMulti
                      value={WEEK_DAYS.filter((day) =>
                        field.value?.includes(day.value)
                      )}
                      onChange={(v) => {
                        const values = v
                          ? (v as any[]).map((opt) => opt.value)
                          : [];
                        updateWorkingHours(index, "week_days", values);
                        field.onChange(values);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={wh.start_time}
                  onChange={(e) =>
                    updateWorkingHours(index, "start_time", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 block mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={wh.end_time}
                  onChange={(e) =>
                    updateWorkingHours(index, "end_time", e.target.value)
                  }
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={() => removeWorkingHours(index)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <FiTrash2 size={16} />
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {workingHours.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No working hours added. Click "Add Working Hours" to add
              schedules.
            </p>
          )}
        </div>

        {/* الأمان */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Password"
              placeholder="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </div>
        </div>

        {/* زر الإرسال */}
        <div className="flex justify-end">
          <Button
            type="submit"
            isloading={isSubmitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating Branch..."
                : "Creating Branch..."
              : isEditMode
              ? "Update Branch"
              : "Create Branch"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBranch;