import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPartenersQuery } from "../../../../app/Api/Slices/partenersApiSlice";
import { useGerBranchByPartnerQuery } from "../../../../app/Api/Slices/BranchesApiSlice";
import { useGetSpecialistBybranchIdQuery } from "../../../../app/Api/Slices/specialistApiSlice";
import { customStyles, type OptionType, type Partner } from "../../../../types";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
  type SingleValue,
} from "react-select";
import {
  getAppointmentSchema,
  type createAppointmentSchemaFormData,
} from "../../../../validation/appointment";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import { FiUser, FiTrash2 } from "react-icons/fi";
import { useGetConsultationRequestByIdQuery } from "../../../../app/Api/Slices/ConsultationApiSlice";
import {
  useEditAppointmentMutation,
  useGetAppointmentByIdQuery,
} from "../../../../app/Api/Slices/appointmentApiSlice";
import { toast } from "react-toastify";

// تعريف الـ types الجديدة
interface ServiceOption {
  id: string;
  value: string;
  label: string;
  name: string;
  cost?: number;
  price?: number;
  quantity?: number;
}

interface AppointmentItem {
  id?: number;
  service_id?: string | null;
  custom_name?: string | null;
  custom_cost?: number | null;
  custom_price?: number | null;
  quantity?: number;
}

interface ExtendedAppointmentFormData extends createAppointmentSchemaFormData {
  items: AppointmentItem[];
}

const defaultSpecialistValues = {
  partener_id: "",
  specialist_id: "",
  request_id: "",
  branch_id: "",
};

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const nationalityTypeOptions = [
  { value: "saudi", label: "Saudi" },
  { value: "NonSaudi", label: "Non Saudi" },
];

const paymentMethodOptions = [
  { value: "payment_link", label: "Payment Link" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "paid_in_clinic", label: "Paid In Clinic" },
  { value: "pos", label: "POS" },
  { value: "stc_pay", label: "STC Pay" },
  { value: "tabby", label: "Tabby" },
];

const transactionStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "successful", label: "Successful" },
  { value: "declined", label: "Declined" },
  { value: "refunded", label: "Refunded" },
];

const EditAppoientment = () => {
  const params = useParams();
  const idAppointment = params.appointmentId;
  const request_id = params.requestId;
  const isEditMode = Boolean(idAppointment);

  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null
  );
  console.log("selectedService", selectedService);
  const [serviceQuantity, setServiceQuantity] = useState<number>(1);
  const [editAppointment] = useEditAppointmentMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExtendedAppointmentFormData>({
    resolver: zodResolver(getAppointmentSchema(isEditMode) as any),
    defaultValues: {
      ...defaultSpecialistValues,
      request_id: request_id || "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  console.log("fields", fields);

  const partener_id = watch("partener_id");
  const medical_branch_id = watch("branch_id");

  const { data: partnersData, isLoading: partnersLoading } =
    useGetPartenersQuery({
      limit: 100,
      page: 1,
    });

  const { data: branchesData, isLoading: branchesLoading } =
    useGerBranchByPartnerQuery(partener_id ? Number(partener_id) : 0, {
      skip: !partener_id,
    });

  const { data: specialistsData, isLoading: specialistsLoading } =
    useGetSpecialistBybranchIdQuery(
      medical_branch_id ? Number(medical_branch_id) : 0,
      { skip: !medical_branch_id }
    );
  const { data: appointmentData } = useGetAppointmentByIdQuery(idAppointment);
  useEffect(() => {
    if (isEditMode && appointmentData) {
      const team = appointmentData.data || appointmentData;
      console.log("appointmentData", team.branch_id);
      const toStringOrEmpty = (value: string | number) =>
        value ? String(value) : "";

      reset({
        partener_id: toStringOrEmpty(team.partener_id),
        branch_id: toStringOrEmpty(team.branch_id),
        specialist_id: toStringOrEmpty(team.specialist_id),
        scheduled_at: toStringOrEmpty(team.scheduled_at),
        identifier: toStringOrEmpty(team.identifier),
        age: toStringOrEmpty(team.age),
        gender: toStringOrEmpty(team.gender),
        date_of_birth: toStringOrEmpty(team.date_of_birth),
        nationality_type: toStringOrEmpty(team.nationality_type),
        nationality: toStringOrEmpty(team.nationality),
        patment_method: toStringOrEmpty(team.patment_method),
        selling_cost: toStringOrEmpty(team.selling_cost),
        service_provider_cost: toStringOrEmpty(team.service_provider_cost),
        discount: toStringOrEmpty(team.discount),
        payment_link: toStringOrEmpty(team.payment_link),
        transaction_status: toStringOrEmpty(team.transaction_status),
        payment_Date: toStringOrEmpty(team.payment_Date),

        items: team?.appointment_items?.map((item: any) => ({
          id: item.id,
          service_id: String(item.service_id),
          custom_name: item.custom_name,
          custom_cost: item.custom_cost,
          custom_price: item.custom_price,
          quantity: item.quantity,
        })),
      });
    }
  }, [isEditMode, appointmentData, reset]);

  const partners = partnersData?.data || [];
  const branches = branchesData?.data || [];
  const specialists = specialistsData?.data || [];

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
  const serviceOptions: ServiceOption[] = useMemo(() => {
    if (!branches || branches.length === 0) return [];

    // إذا كان هناك medical_branch_id، ابحث في ذلك الفرع
    if (medical_branch_id) {
      const selectedBranch = branches.find(
        (branch: any) => String(branch.id) === medical_branch_id
      );

      if (selectedBranch) {
        const allServices: ServiceOption[] = [];

        selectedBranch.catagories?.forEach((catagory: any) => {
          if (catagory.catagory?.services) {
            catagory.catagory.services.forEach((service: any) => {
              allServices.push({
                value: String(service.id),
                label: service.name,
                cost: parseFloat(service.cost) || 0,
                price: parseFloat(service.price) || 0,
                id: service.id,
                name: service.name,
                quantity: 1,
              });
            });
          }
        });

        return allServices;
      }
    }

    // إذا لم يكن هناك medical_branch_id أو لم يتم العثور على الفرع
    // اجمع الخدمات من جميع الفروع
    const allServices: ServiceOption[] = [];

    branches.forEach((branch: any) => {
      branch.catagories?.forEach((catagory: any) => {
        if (catagory.catagory?.services) {
          catagory.catagory.services.forEach((service: any) => {
            // تحقق من عدم تكرار الخدمات (باستخدام service.id)
            if (!allServices.some((s) => s.value === String(service.id))) {
              allServices.push({
                value: String(service.id),
                label: service.name,
                cost: parseFloat(service.cost) || 0,
                price: parseFloat(service.price) || 0,
                id: service.id,
                name: service.name,
                quantity: 1,
              });
            }
          });
        }
      });
    });

    return allServices;
  }, [branches, medical_branch_id]);

  console.log("serviceOptions", specialistOptions);

  const handlePartnerChange = (partnerId: string) => {
    setValue("branch_id", "");
    setValue("specialist_id", "");
  };

  const handleBranchChange = (branchId: string) => {
    setValue("specialist_id", "");
  };

  const handleAddService = () => {
    if (selectedService) {
      append({
        service_id: selectedService.value,
        quantity: serviceQuantity,
      });
      setSelectedService(null);
      setServiceQuantity(1);
    }
  };

  const handleAddCustomItem = () => {
    const nameInput = document.getElementById(
      "customItemName"
    ) as HTMLInputElement;
    const costInput = document.getElementById(
      "customItemCost"
    ) as HTMLInputElement;
    const priceInput = document.getElementById(
      "customItemPrice"
    ) as HTMLInputElement;
    const quantityInput = document.getElementById(
      "customItemQuantity"
    ) as HTMLInputElement;

    if (nameInput && costInput && priceInput) {
      const name = nameInput.value;
      const cost = costInput.value;
      const price = priceInput.value;
      const quantity = quantityInput.value;

      if (name && cost && price) {
        append({
          custom_name: name,
          custom_cost: Number(cost),
          custom_price: Number(price),
          quantity: Number(quantity),
        });

        // Reset inputs
        nameInput.value = "";
        costInput.value = "";
        priceInput.value = "";
        quantityInput.value = "";
      }
    }
  };

  const calculateTotal = (): number => {
    return fields.reduce((total, item) => {
      const quantity = item.quantity || 1;

      // تحقق إذا كانت خدمة قياسية
      if (
        item.service_id &&
        item.service_id !== "null" &&
        item.service_id !== ""
      ) {
        const service = serviceOptions.find((s) => s.value === item.service_id);
        const price = service?.price || 0;
        return total + price * quantity;
      } else {
        // خدمة مخصصة
        const price = item.custom_price || 0;
        return total + price * quantity;
      }
    }, 0);
  };
  const handleFormSubmit = async (data: ExtendedAppointmentFormData) => {
    // معالجة service_id بشكل صحيح
    const itemsToSend = fields.map((item) => ({
      id: item.id,
      // تحويل "null" إلى null فعلي
      service_id:
        item.service_id && item.service_id !== "null"
          ? Number(item.service_id)
          : null,
      custom_name: item.custom_name ?? null,
      custom_cost: item.custom_cost ? Number(item.custom_cost) : null,
      custom_price: item.custom_price ? Number(item.custom_price) : null,
      quantity: Number(item.quantity) || 1,
    }));

    const payload = {
      ...data,
      items: itemsToSend,
    };

    console.log("Submitting payload:", payload);

    try {
      if (isEditMode) {
        const response = await editAppointment({
          id: idAppointment,
          data: payload,
        }).unwrap();
        toast.success(response.message);
      }
    } catch (error: unknown | any) {
      console.error("Error updating appointment:", error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit appointment" : "Add New appointment"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update appointment information and details"
            : "Create a new appointment with the form below"}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* المعلومات الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* اختيار الشريك */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Select Partner *
              {partener_id && branchesLoading && (
                <span className="text-sm text-blue-600 ml-2">(Loading...)</span>
              )}
            </label>
            <Controller
              control={control}
              name="partener_id"
              render={({ field }) => (
                <PartnerSelect
                  options={partnerOptions}
                  isLoading={partnersLoading}
                  value={
                    partnerOptions.find((o) => o.value === field.value) ?? null
                  }
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                    handlePartnerChange(value);
                  }}
                  noOptionsMessage={() => "No partners found"}
                />
              )}
            />
            {errors.partener_id && (
              <p className="text-sm text-red-600 mt-1">
                {errors.partener_id.message}
              </p>
            )}
          </div>

          {/* حقل request_id مخفي */}
          <input type="hidden" {...register("request_id")} />

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
              name="branch_id"
              render={({ field }) => (
                <Select<{ value: string; label: string }>
                  options={branchOptions}
                  isLoading={branchesLoading}
                  value={
                    branchOptions.find((o) => o.value === field.value) ?? null
                  }
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                    handleBranchChange(value);
                  }}
                  placeholder={
                    !partener_id
                      ? "Please select a partner first"
                      : "Select medical branch"
                  }
                  styles={customStyles}
                  isDisabled={!partener_id || branchesLoading}
                  noOptionsMessage={() =>
                    !partener_id
                      ? "Please select a partner first"
                      : "No branches found"
                  }
                />
              )}
            />
            {errors.branch_id && (
              <p className="text-sm text-red-600 mt-1">
                {errors.branch_id?.message}
              </p>
            )}
          </div>

          {/* اختيار المتخصصين */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-700 block">
                Specialists *
              </label>
            </div>
            <Controller
              control={control}
              name="specialist_id"
              render={({ field }) => (
                <Select<{ value: string; label: string }>
                  options={specialistOptions}
                  isLoading={specialistsLoading}
                  value={
                    specialistOptions.find((o) => o.value === field.value) ??
                    null
                  }
                  onChange={(opt) => {
                    const value = opt ? opt.value : "";
                    field.onChange(value);
                  }}
                  placeholder={
                    !medical_branch_id
                      ? "Please select a branch first"
                      : `Select specialists`
                  }
                  styles={customStyles}
                  isDisabled={!medical_branch_id || specialistsLoading}
                  noOptionsMessage={() =>
                    !medical_branch_id
                      ? "Please select a branch first"
                      : "No specialists found"
                  }
                />
              )}
            />
            {errors.specialist_id && (
              <p className="text-sm text-red-600 mt-1">
                {errors.specialist_id?.message}
              </p>
            )}
          </div>

          {/* باقي الحقول الأساسية */}
          <Input
            label="Customer Service Date"
            placeholder="YYYY-MM-DD"
            type="date"
            {...register("scheduled_at")}
            error={!!errors.scheduled_at}
            helperText={errors.scheduled_at?.message}
          />

          <Input
            label="National ID"
            placeholder="Enter National ID"
            {...register("identifier")}
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
          />

          <Input
            label="Age"
            placeholder="Enter age"
            {...register("age")}
            error={!!errors.age}
            helperText={errors.age?.message}
          />

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
                />
              )}
            />
            {errors.gender && (
              <p className="text-sm text-red-600 mt-1">
                {errors.gender?.message}
              </p>
            )}
          </div>

          <Input
            label="Date of Birth"
            placeholder="Enter date of birth"
            type="date"
            {...register("date_of_birth")}
            error={!!errors.date_of_birth}
            helperText={errors.date_of_birth?.message}
          />

          <div>
            <label className="font-bold text-gray-700  mb-1 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Nationality
            </label>
            <Controller
              control={control}
              name="nationality_type"
              render={({ field }) => (
                <Select<{ value: string; label: string }>
                  options={nationalityTypeOptions}
                  value={
                    nationalityTypeOptions.find(
                      (o) => o.value === field.value
                    ) ?? null
                  }
                  onChange={(opt) => field.onChange(opt ? opt.value : "")}
                  placeholder="Select nationality type"
                  styles={customStyles}
                />
              )}
            />
            {errors.nationality_type && (
              <p className="text-sm text-red-600 mt-1">
                {errors.nationality_type?.message}
              </p>
            )}
          </div>

          <Input
            label="nationality"
            placeholder="Enter nationality"
            {...register("nationality")}
            error={!!errors.nationality}
            helperText={errors.nationality?.message}
          />

          <div>
            <label className="font-bold text-gray-700  mb-1 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Payment Method
            </label>
            <Controller
              control={control}
              name="patment_method"
              render={({ field }) => (
                <Select<{ value: string; label: string }>
                  options={paymentMethodOptions}
                  value={
                    paymentMethodOptions.find((o) => o.value === field.value) ??
                    null
                  }
                  onChange={(opt) => field.onChange(opt ? opt.value : "")}
                  placeholder="Select payment method"
                  styles={customStyles}
                />
              )}
            />
            {errors.patment_method && (
              <p className="text-sm text-red-600 mt-1">
                {errors.patment_method?.message}
              </p>
            )}
          </div>

          <Input
            label="Service Provider Cost"
            placeholder="Enter Service Provider Cost"
            {...register("service_provider_cost")}
            error={!!errors.service_provider_cost}
            helperText={errors.service_provider_cost?.message}
          />

          <Input
            label="Selling Cost"
            placeholder="Enter Sale Cost"
            {...register("selling_cost")}
            error={!!errors.selling_cost}
            helperText={errors.selling_cost?.message}
          />

          <Input
            label="Payment Link"
            placeholder="Enter Payment Link"
            {...register("payment_link")}
            error={!!errors.payment_link}
            helperText={errors.payment_link?.message}
          />

          <Input
            label="Discount %"
            placeholder="Enter discount"
            {...register("discount")}
            error={!!errors.discount}
            helperText={errors.discount?.message}
          />

          <div>
            <label className="font-bold text-gray-700  mb-1 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Transaction Status
            </label>
            <Controller
              control={control}
              name="transaction_status"
              render={({ field }) => (
                <Select<{ value: string; label: string }>
                  options={transactionStatusOptions}
                  value={
                    transactionStatusOptions.find(
                      (o) => o.value === field.value
                    ) ?? null
                  }
                  onChange={(opt) => field.onChange(opt ? opt.value : "")}
                  placeholder="Select Transaction Status"
                  styles={customStyles}
                />
              )}
            />
            {errors.transaction_status && (
              <p className="text-sm text-red-600 mt-1">
                {errors.transaction_status?.message}
              </p>
            )}
          </div>

          <Input
            label="Payment Date"
            placeholder="Enter payment date"
            type="date"
            {...register("payment_Date")}
            error={!!errors.payment_Date}
            helperText={errors.payment_Date?.message}
          />
        </div>

        {/* قسم الخدمات والمنتجات */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Service</h3>

          {/* إضافة خدمة موجودة */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Add Service</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Select Services
                </label>
                <Select<ServiceOption>
                  options={serviceOptions}
                  value={selectedService}
                  onChange={setSelectedService}
                  placeholder="Select service"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Add Quantity
                </label>
                <div className="flex items-center gap-2">
                  <input
                    min="1"
                    value={serviceQuantity}
                    onChange={(e) => setServiceQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* إضافة عنصر مخصص */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">
              Additional Services
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  service Name
                </label>
                <input
                  type="text"
                  placeholder="Item name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="customItemName"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Item Cost
                </label>
                <input
                  placeholder="Cost"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="customItemCost"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Item Price
                </label>
                <input
                  placeholder="Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="customItemPrice"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Item Quantity
                </label>
                <input
                  type="quantity"
                  placeholder="Quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="customItemQuantity"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Services
                </button>
              </div>
            </div>
          </div>

          {/* قائمة العناصر المضافة */}
          {fields.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-3">
                Added Services
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Item Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Cost
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Qty
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Total
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => {
                      const item = field;

                      // تحديد إذا كانت خدمة قياسية أم مخصصة
                      const isStandardService =
                        item.service_id &&
                        item.service_id !== "null" &&
                        item.service_id !== "";

                      let name = "";
                      let cost = 0;
                      let price = 0;

                      if (isStandardService) {
                        // البحث عن الخدمة القياسية
                        const service = serviceOptions.find(
                          (s) => s.value === item.service_id
                        );
                        name = service?.label || `Service #${item.service_id}`;
                        cost = service?.cost || 0;
                        price = service?.price || 0;
                      } else {
                        // خدمة مخصصة
                        name = item.custom_name || "Custom Item";
                        cost = item.custom_cost || 0;
                        price = item.custom_price || 0;
                      }

                      const quantity = item.quantity || 1;
                      const total = price * quantity;

                      return (
                        <tr key={field.id}>
                          <td className="border border-gray-300 px-4 py-2">
                            <div>
                              <div className="font-medium">{name}</div>
                              {isStandardService ? (
                                <div className="text-xs text-blue-600">
                                  Standard Service
                                </div>
                              ) : (
                                <div className="text-xs text-yellow-600">
                                  Custom Service
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            SAR {cost.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            SAR {price.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                const newValue = Math.max(
                                  1,
                                  Number(e.target.value)
                                );
                                setValue(`items.${index}.quantity`, newValue);
                              }}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">
                            SAR {total.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                              title="Remove item"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan={4}
                        className="border border-gray-300 px-4 py-2 text-right font-semibold"
                      >
                        Total:
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        ${calculateTotal()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* زر الإرسال */}
        <div className="flex justify-end pt-4">
          <Button type="submit" isloading={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Appointment"}
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

interface PartnerSelectProps {
  options: OptionType[];
  isLoading?: boolean;
  isDisabled?: boolean;
  value?: OptionType | null;
  onChange: (opt: OptionType | null) => void;
  noOptionsMessage?: () => string;
}

const PartnerSelect: React.FC<PartnerSelectProps> = ({
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

export default EditAppoientment;
