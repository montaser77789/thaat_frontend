import { Link } from "react-router-dom";
import PatientList from "../../components/consultation_requests/PatientList";
import type { PatientRow } from "../../interfaces/indrx";
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
import "react-phone-number-input/style.css";
import { consultationSchema } from "../../validation/consultation";
import { useGetCityQuery } from "../../app/Api/Slices/CityApiSlice";
import Select from "../../components/ui/Select";
import { useGetServicesQuery } from "../../app/Api/Slices/ServiceApiSlice";

const mockPatients: PatientRow[] = [
  {
    id: 2102,
    patientName: "montaser gohar",
    serviceType: "Tabib Doctor at Home",
    status: "New Order",
    date: "2025-11-11",
    transactionStatus: "Successful",
    paymentMethod: "-",
    serviceProviderName: "-",
    orderPrice: 0,
  },
  {
    id: 2101,
    patientName: "Ahmed",
    serviceType: "Filler o Botics 1",
    status: "New Order",
    date: "2025-11-08",
    transactionStatus: "-",
    paymentMethod: "-",
    serviceProviderName: "-",
    orderPrice: 0,
  },
  {
    id: 2100,
    patientName: "Testing Demo 3",
    serviceType: "-",
    status: "New Order",
    date: "2025-11-07",
    transactionStatus: "-",
    paymentMethod: "-",
    serviceProviderName: "-",
    orderPrice: 0,
  },
];

export default function ConsultationRequests() {
  // لحد ما تربطها فعلياً بالـ query params هنحطها ثابتة
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);

  const dateLabel = new Date().toLocaleDateString();

  return (
    <div className="  ">
      <div className=" mx-auto px-4 space-y-8">
        <div className="flex items-center gap-3">
          <Link to="/admins/consultation_requests">
            <button className="inline-flex items-center justify-center rounded-lg bg-black p-2 hover:bg-gray-900 transition">
              <svg
                width="30"
                height="32"
                viewBox="0 0 30 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="32" rx="4" fill="black" />
                <path
                  d="M12.975 10.9414L7.91663 15.9997L12.975 21.0581"
                  stroke="white"
                  strokeWidth="1.25"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.0834 16H8.05835"
                  stroke="white"
                  strokeWidth="1.25"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Link>

          <h2 className="text-gray-900 sm:tracking-tight">
            <span className="block text-xl md:text-2xl font-semibold">
              Daily Transaction Report:
            </span>
            <span className="inline-flex items-center rounded-lg bg-blue-100 text-blue-900 text-sm md:text-base font-normal px-3 py-1 mt-2">
              {dateLabel}
            </span>
          </h2>
          <Button onClick={() => setIsOpen(true)} className="ml-auto">
            <FiPlus className="mr-2" />
            Create Appointment
          </Button>
        </div>

        {/* Table */}
        <div className="">
          <PatientList rows={mockPatients} />
        </div>
      </div>

      <CreateAppointment isOpen={isOpen} setIsOpen={setIsOpen} />
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
  const { data: servicea } = useGetServicesQuery({});
  const cities = data?.data || [];

  const services = servicea?.data || [];
  console.log("data", services);

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

  const onSubmit = (data: any) => {
    const rawPhone = data.phone_number || "";

    const normalizedPhone = rawPhone.replace(/^\+/, "");

    const payload = {
      ...data,
      phone_number: normalizedPhone, // ده اللي تبعته للباك
    };

    console.log("payload to backend:", payload);
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
          label="Service"
          placeholder="Select Service"
          {...register("service_id")}
          error={!!errors.service_id}
          helperText={errors.service_id?.message}
          options={services.map((city: any) => ({
            value: city.id,
            label: city.name,
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
