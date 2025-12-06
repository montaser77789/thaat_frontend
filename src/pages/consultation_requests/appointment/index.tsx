import { useParams } from "react-router-dom";
import {
  useGetConsultationRequestByIdQuery,
  useUpdateConsultationRequestMutation,
} from "../../../app/Api/Slices/ConsultationApiSlice";
import Input from "../../../components/ui/Input";
import type z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import "react-international-phone/style.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useGetCatagoresQuery } from "../../../app/Api/Slices/catagoryApiSlice";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";
import { useGetCityQuery } from "../../../app/Api/Slices/CityApiSlice";
import { consultationSchema } from "../../../validation/consultation";
import ViewAppointment from "../../../components/appointment/ViewAppointment";
import { FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";

const Appointment = () => {
  const params = useParams();
  const id = params.cosultationRequestId;

  const [isEditing, setIsEditing] = useState(false); // NEW

  const { data: consultationRequest } = useGetConsultationRequestByIdQuery(id);
  const [update] = useUpdateConsultationRequestMutation();
  console.log("consultationRequest", consultationRequest);
  const { data: catagory } = useGetCatagoresQuery({});
  const { data } = useGetCityQuery({});

  const cities = data?.data || [];
  const catagoryes = catagory?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
  });

  useEffect(() => {
    if (consultationRequest?.data) {
      reset({
        name: consultationRequest.data.name,
        phone_number: consultationRequest.data.phone_number,
        catagory_id: String(consultationRequest.data.catagory_id),
        neighborhood: consultationRequest.data.neighborhood,
        additional_details: consultationRequest.data.additional_details,
        city_id: String(consultationRequest.data.city_id),
      });
    }
  }, [consultationRequest, reset]);



  const onSubmit = async (data: any) => {
    try {
      const res = await update({
        id: id,
        data: data,
      }).unwrap();

      toast.success(res.message);
    } catch (error: unknown | any) {
      console.error("Error creating  request:", error);
      toast.error(error?.data?.message);
    }
  };
  const normalizePhone = (num: string) => {
    if (!num.startsWith("+")) return "+" + num;
    return num;
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-6">
        <form
          id="consult-form"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-left">
            <Input
              label="Patient Name"
              placeholder="Patient Name"
              readOnly={!isEditing}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <div>
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
                    disabled={!isEditing}
                    defaultCountry="SA"
                    countries={["SA", "EG"]}
                    placeholder="Enter phone number"
                    countryCallingCodeEditable={false}
                    value={field.value ? normalizePhone(field.value) : ""}
                    onChange={(v) => field.onChange(normalizePhone(v || ""))}
                    inputComponent={Input}
                    style={{ direction: "ltr" }}
                  />
                )}
              />
              <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <Select
              label="Service"
              placeholder="Select Service"
              disabled={!isEditing}
              {...register("catagory_id")}
              error={!!errors.catagory_id}
              helperText={errors.catagory_id?.message}
              options={catagoryes.map((city: any) => ({
                value: city.id,
                label: city.name_en,
              }))}
            />

            <Select
              label="City"
              placeholder="Select City"
              disabled={!isEditing}
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
              disabled={!isEditing}
              {...register("neighborhood")}
              error={!!errors.neighborhood}
              helperText={errors.neighborhood?.message}
            />
          </div>
          <div className="grid grid-cols-1  gap-4 text-left">
            <Textarea
              placeholder="Additional Details"
              label="Description"
              disabled={!isEditing}
              {...register("additional_details")}
              error={!!errors.additional_details}
              helperText={errors.additional_details?.message}
            />
          </div>
          <div className="flex gap-3 mb-4">
            {!isEditing ? null : (
              <>
                <Button type="submit">Save</Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    reset(consultationRequest?.data);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-3 mb-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            ) : (
              <></>
            )}
          </div>
        </form>
      </div>
      <div className="mt-4">
        <ViewAppointment
          requestId={id}
          appointment={consultationRequest?.data.appointment}
        />
      </div>
    </>
  );
};

export default Appointment;
