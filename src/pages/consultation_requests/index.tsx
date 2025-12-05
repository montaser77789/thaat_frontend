import PatientList from "../../components/consultation_requests/PatientList";
import Button from "../../components/ui/Button";
import { FiPlus } from "react-icons/fi";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import "react-international-phone/style.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { consultationSchema } from "../../validation/consultation";
import { useGetCityQuery } from "../../app/Api/Slices/CityApiSlice";
import Select from "../../components/ui/Select";
import { useCreateConsultationRequestMutation } from "../../app/Api/Slices/ConsultationApiSlice";
import { toast } from "react-toastify";
import { useGetCatagoresQuery } from "../../app/Api/Slices/catagoryApiSlice";

export default function ConsultationRequests() {
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);

  return (
    <div className="  ">
      <div className=" mx-auto px-4 space-y-8">
        {/* Table */}
        <div className="">
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsOpen(true)} className="ml-auto">
              <FiPlus className="mr-2" />
              Create Appointment
            </Button>
          </div>
          <PatientList />
        </div>
        <CreateAppointment isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}

const CreateAppointment = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [phoneValue, setPhoneValue] = useState<string>("");
  const { data } = useGetCityQuery({});
  const { data: catagory } = useGetCatagoresQuery({});
  const cities = data?.data || [];
  const [createConsultationRequest] = useCreateConsultationRequestMutation({});

  const catagoryes = catagory?.data || [];
  console.log("data", catagory);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: any) => {
    const rawPhone = data.phone_number || "";

    const normalizedPhone = rawPhone.replace(/^\+/, "");

    const payload = {
      ...data,
      phone_number: normalizedPhone,
      service_id: Number(data.service_id),
      city_id: Number(data.city_id),
    };
    console.log("payload to backend:", payload);

    try {
      const response = await createConsultationRequest(payload).unwrap();
      console.log("response", response);
      reset();
      setIsOpen(false);
      toast.success(response.message);
    } catch (error: unknown | any) {
      console.error("Error creating  request:", error);
      toast.error(error?.data?.message);
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneValue(value || "");
    setValue("phone_number", value || "");
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      title="Create Appointment"
    >
      <form className="space-y-4" dir="rtl" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Patient Name"
          placeholder="Patient Name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <div dir="ltr">
          <label className="font-bold text-gray-700 block mb-1">
            Phone Number
          </label>

          <Controller
            name="phone_number"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PhoneInput
                international
                defaultCountry="SA"
                countries={["SA", "EG"]} // دي صح في المكتبة دي
                placeholder="Phone Number"
                countryCallingCodeEditable={false}
                value={field.value}
                onChange={handlePhoneChange}
                inputComponent={Input}
                style={{ direction: "ltr" }}
              />
            )}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone_number.message}
            </p>
          )}
        </div>

        <Select
          label="catagory"
          placeholder="Select catagory"
          {...register("catagory_id")}
          error={!!errors.catagory_id}
          helperText={errors.catagory_id?.message}
          options={catagoryes?.map((city: any) => ({
            value: city.id,
            label: city.name_en,
          }))}
        />

        <Select
          label="City"
          placeholder="Select City"
          {...register("city_id")}
          error={!!errors.city_id}
          helperText={errors.city_id?.message}
          options={cities.map((city: any) => ({
            value: city.id,
            label: city.name,
          }))}
        />

        <Input
          label="Neighborhood"
          placeholder="Neighborhood"
          {...register("neighborhood")}
          error={!!errors.neighborhood}
          helperText={errors.neighborhood?.message}
        />
        <Textarea
          placeholder="Additional Details"
          label="Description"
          {...register("additional_details")}
          error={!!errors.additional_details}
          helperText={errors.additional_details?.message}
        />
        <div className="flex gap-4">
          <Button type="submit">Create</Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              reset();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
