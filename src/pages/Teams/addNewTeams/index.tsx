import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetCityQuery } from "../../../app/Api/Slices/CityApiSlice";
import { useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  getTeamSchema,
  type createTeamSchemaFormData,
} from "../../../validation/teams";
import Input from "../../../components/ui/Input";
import { FiMapPin } from "react-icons/fi";
import { customStyles, type OptionType, type Partner } from "../../../types";
import { toast } from "react-toastify";
import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import { useGerBranchByPartnerQuery } from "../../../app/Api/Slices/BranchesApiSlice";
import { useGetPartnersByCityIdQuery } from "../../../app/Api/Slices/partenersApiSlice";
import { useGetSpecialistBybranchIdQuery } from "../../../app/Api/Slices/specialistApiSlice";
import {
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useGetTeamByIdQuery, // إضافة هذا الـ hook
} from "../../../app/Api/Slices/teamsApiSlice";

const defaultSpecialistValues: createTeamSchemaFormData = {
  name: "",
  name_ar: "",
  status: "",
  city_id: "",
  partenerId: "",
  medical_branch_id: "",
  specialistsIds: [],
};

const AddNewTeam = () => {
  const navigate = useNavigate();
  const params = useParams();
  const idTeam = params.id;
  const isEditMode = Boolean(idTeam);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<createTeamSchemaFormData>({
    resolver: zodResolver(getTeamSchema(isEditMode) as any),
    defaultValues: defaultSpecialistValues,
  });

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();

  // جلب بيانات الفريق في وضع التعديل
  const { data: teamData, isLoading: isTeamLoading } = useGetTeamByIdQuery(
    idTeam!,
    { skip: !isEditMode }
  );

  const cityId = watch("city_id");
  const partenerId = watch("partenerId");
  const medical_branch_id = watch("medical_branch_id");

  // API Calls - التسلسل المنطقي
  const { data: citiesData, isLoading: citiesLoading } = useGetCityQuery({});

  // جلب الشركاء بناءً على المدينة المختارة
  const { data: partnersByCityData, isLoading: partnersByCityLoading } =
    useGetPartnersByCityIdQuery(cityId ? Number(cityId) : 0, {
      skip: !cityId,
    });

  // جلب الفروع بناءً على الشريك المختار
  const { data: branchesData, isLoading: branchesLoading } =
    useGerBranchByPartnerQuery(partenerId ? Number(partenerId) : 0, {
      skip: !partenerId,
    });

  // جلب المتخصصين بناءً على الفرع المختار
  const { data: specialistsData, isLoading: specialistsLoading } =
    useGetSpecialistBybranchIdQuery(
      medical_branch_id ? Number(medical_branch_id) : 0,
      {
        skip: !medical_branch_id,
      }
    );

  // ملء النموذج ببيانات الفريق في وضع التعديل
  useEffect(() => {
    if (isEditMode && teamData) {
      const team = teamData.data || teamData;
      console.log("Team data for edit:", team);

      reset({
        name: team.name || "",
        name_ar: team.name_ar || "",
        status: team.status || "",
        city_id: String(team.city_id) || "",
        partenerId: String(team.medical_branch?.partner_id) || "",
        medical_branch_id: String(team.medical_branch_id) || "",
        specialistsIds:
          team.members?.map((member: any) => String(member.specialist_id)) ||
          [],
      });
    }
  }, [isEditMode, teamData, reset]);

  const onSubmit = async (data: createTeamSchemaFormData) => {
    try {
      console.log("Form Data:", data);

      // تحويل البيانات إلى التنسيق المطلوب للـ API
      const teamData = {
        name: data.name,
        name_ar: data.name_ar,
        status: data.status,
        city_id: Number(data.city_id),
        partenerId: Number(data.partenerId),
        medical_branch_id: Number(data.medical_branch_id),
        specialistsIds: data.specialistsIds.map((id) => Number(id)),
      };

      if (isEditMode && idTeam) {
        // تحديث الفريق
        await updateTeam({ id: idTeam, data: teamData }).unwrap();
        toast.success("Team updated successfully");
      } else {
        // إنشاء فريق جديد
        await createTeam(teamData).unwrap();
        toast.success("Team created successfully");
      }

      navigate("/admins/teams"); // الانتقال إلى صفحة الفرق بعد الحفظ
    } catch (error: unknown | any) {
      console.error("Error creating  request:", error);
      toast.error(error?.data?.message);
    }
  };

  // البيانات والمتغيرات المحسوبة
  const cities = citiesData?.data || [];
  const partners = partnersByCityData?.data || [];
  const branches = branchesData?.data || [];
  const specialists = specialistsData?.data || [];

  const cityOptions = useMemo(
    () =>
      cities.map((city: any) => ({
        value: String(city.id),
        label: city.name,
      })),
    [cities]
  );

  const partnerOptions: OptionType[] = useMemo(
    () =>
      partners.map((p: Partner) => ({
        value: String(p.id),
        label: p.name,
        logo: p.logo_url ?? null,
      })),
    [partners]
  );

  const branchOptions: OptionType[] = useMemo(
    () =>
      branches.map((branch: any) => ({
        value: String(branch.id),
        label: branch.name,
      })),
    [branches]
  );

  const specialistOptions: OptionType[] = useMemo(
    () =>
      specialists.map((specialist: any) => ({
        value: String(specialist.id),
        label: specialist.name,
        image: specialist.image_url,
      })),
    [specialists]
  );

  // معالجة تغيير المدينة
  const handleCityChange = (cityId: string) => {
    setValue("partenerId", "");
    setValue("medical_branch_id", "");
    setValue("specialistsIds", []);
  };

  // معالجة تغيير الشريك
  const handlePartnerChange = (partnerId: string) => {
    setValue("medical_branch_id", "");
    setValue("specialistsIds", []);
  };

  // معالجة تغيير الفرع
  const handleBranchChange = (branchId: string) => {
    setValue("specialistsIds", []);
  };

  // اختيار جميع المتخصصين
  const handleSelectAllSpecialists = () => {
    const allSpecialistIds = specialistOptions.map((option) => option.value);
    setValue("specialistsIds", allSpecialistIds);
  };

  // إلغاء اختيار جميع المتخصصين
  const handleClearAllSpecialists = () => {
    setValue("specialistsIds", []);
  };

  const isLoading = isCreating || isUpdating || isSubmitting || isTeamLoading;

  if (isEditMode && isTeamLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Team" : "Add New Team"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update team information and details"
            : "Create a new team with the form below"}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Grid للبيانات الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اسم الفريق */}
          <div>
            <Input
              label="Team Name *"
              placeholder="Enter team name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
            />
          </div>

          {/* الاسم العربي للفريق */}
          <div>
            <Input
              label="Arabic Team Name *"
              placeholder="أدخل اسم الفريق بالعربية"
              {...register("name_ar")}
              error={!!errors.name_ar}
              helperText={errors.name_ar?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Grid للاختيارات الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* اختيار المدينة */}
          <div>
            <label className="font-bold text-gray-700 mb-1 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              City *
              {cityId && partnersByCityLoading && (
                <span className="text-sm text-blue-600">(Loading...)</span>
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
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                    handleCityChange(value);
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

          {/* اختيار الشريك */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Select Partner *
              {partenerId && branchesLoading && (
                <span className="text-sm text-blue-600 ml-2">(Loading...)</span>
              )}
            </label>
            <Controller
              control={control}
              name="partenerId"
              render={({ field }) => (
                <PartnerSelect
                  options={partnerOptions}
                  isLoading={partnersByCityLoading}
                  value={
                    partnerOptions.find((o) => o.value === field.value) ?? null
                  }
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                    handlePartnerChange(value);
                  }}
                  isDisabled={!cityId || isLoading || partnersByCityLoading}
                  noOptionsMessage={() =>
                    !cityId ? "Please select a city first" : "No partners found"
                  }
                />
              )}
            />
            {errors.partenerId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.partenerId.message}
              </p>
            )}
          </div>

          {/* حالة الفريق */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Status *
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select<{ value: string; label: string }>
                  options={[
                    { value: "ACTIVE", label: "Active" },
                    { value: "INACTIVE", label: "Inactive" },
                  ]}
                  value={
                    [
                      { value: "ACTIVE", label: "Active" },
                      { value: "INACTIVE", label: "Inactive" },
                    ].find((o) => o.value === field.value) ?? null
                  }
                  onChange={(opt) => field.onChange(opt ? opt.value : "")}
                  placeholder="Select status"
                  styles={customStyles}
                  isDisabled={isLoading}
                />
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">
                {errors.status?.message}
              </p>
            )}
          </div>
        </div>

        {/* Grid للفروع والمتخصصين */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* اختيار الفرع الطبي */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Medical Branch *
              {medical_branch_id && specialistsLoading && (
                <span className="text-sm text-blue-600 ml-2">(Loading...)</span>
              )}
            </label>
            <Controller
              control={control}
              name="medical_branch_id"
              render={({ field }) => (
                <Select<{ value: string; label: string }>
                  options={branchOptions}
                  isLoading={branchesLoading}
                  value={
                    branchOptions.find(
                      (o: OptionType) => o.value === field.value
                    ) ?? null
                  }
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                    handleBranchChange(value);
                  }}
                  placeholder={
                    !partenerId
                      ? "Please select a partner first"
                      : "Select medical branch"
                  }
                  styles={customStyles}
                  isDisabled={!partenerId || isLoading || branchesLoading}
                  noOptionsMessage={() =>
                    !partenerId
                      ? "Please select a partner first"
                      : "No branches found"
                  }
                />
              )}
            />
            {errors.medical_branch_id && (
              <p className="text-sm text-red-600 mt-1">
                {errors.medical_branch_id?.message}
              </p>
            )}
          </div>

          {/* اختيار المتخصصين */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700 block">
                Specialists *
              </label>
              {specialistOptions.length > 0 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllSpecialists}
                    className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllSpecialists}
                    className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <Controller
              control={control}
              name="specialistsIds"
              render={({ field }) => (
                <Select
                  options={specialistOptions}
                  isLoading={specialistsLoading}
                  value={specialistOptions.filter((o) =>
                    Array.isArray(field.value)
                      ? field.value.includes(o.value)
                      : false
                  )}
                  onChange={(opts) => {
                    const values = Array.isArray(opts)
                      ? opts.map((opt) => opt.value)
                      : [];
                    field.onChange(values);
                  }}
                  placeholder={
                    !medical_branch_id
                      ? "Please select a branch first"
                      : `Select specialists (${specialistOptions.length} available)`
                  }
                  styles={customStyles}
                  isMulti
                  isDisabled={
                    !medical_branch_id || isLoading || specialistsLoading
                  }
                  noOptionsMessage={() =>
                    !medical_branch_id
                      ? "Please select a branch first"
                      : "No specialists found"
                  }
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                />
              )}
            />

            {/* عرض عدد المتخصصين المختارين */}
            {Array.isArray(watch("specialistsIds")) &&
              watch("specialistsIds").length > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  {watch("specialistsIds").length} specialist(s) selected
                </p>
              )}

            {errors.specialistsIds && (
              <p className="text-sm text-red-600 mt-1">
                {errors.specialistsIds?.message}
              </p>
            )}
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update Team"
              : "Create Team"}
          </button>
        </div>
      </form>
    </div>
  );
};

// مكونات الـ Select المخصصة (نفس الكود السابق)
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
  isDisabled?: boolean;
  value?: OptionType | null;
  onChange: (opt: OptionType | null) => void;
  noOptionsMessage?: () => string;
}> = ({
  options,
  isLoading,
  isDisabled,
  onChange,
  value,
  noOptionsMessage,
}) => {
  return (
    <Select
      options={options}
      isLoading={isLoading}
      isClearable
      isDisabled={isDisabled}
      placeholder="Select Partner"
      onChange={(v) => onChange(v as OptionType | null)}
      components={{ Option, SingleValue }}
      styles={customStyles}
      value={value}
      noOptionsMessage={noOptionsMessage}
    />
  );
};

export default AddNewTeam;
