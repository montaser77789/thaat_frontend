import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "../../../app/Api/Slices/AuthApiSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface LoginFormInputs {
  mobile: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [flashMessage, setFlashMessage] = useState<string>("");
  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await login(data).unwrap();
      Cookies.set("access_token", response.data.token, { expires: 3 });
      toast.success(response.message);
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      // فشل
      if (err.data?.status === "fail") {
        toast.error(err.data.message);
        setFlashMessage(err.data.message);
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="https://staging.thaat.app/assets/blueLogo-f8bb2555b639f673ebe2231b6c8423426c5c0495c15e197c0b2e7ba291c8b4f4.svg"
              alt="logo"
              className="w-24 h-24"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Sign In to your account
          </h1>

          {/* Flash Message */}
          {flashMessage && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded text-center">
              {flashMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Identifier */}
            <div>
              <label
                htmlFor="mobile"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Mobile / Email
              </label>
              <input
                id="mobile"
                type="text"
                placeholder="Enter mobile number or email"
                {...register("mobile", {
                  required: "This field is required",
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-3"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M6.23 6.23A10.45 10.45 0 0112 4.5c4.76 0 8.77 3.16 10.06 7.5a10.52 10.52 0 01-4.29 5.77M12 19.5a10.45 10.45 0 01-5.77-1.73"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.04 12.32a1.01 1.01 0 010-.64C3.42 7.51 7.36 4.5 12 4.5c4.64 0 8.57 3.01 9.96 7.18a1.01 1.01 0 010 .64C20.57 16.49 16.64 19.5 12 19.5c-4.64 0-8.57-3.01-9.96-7.18z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  {...register("remember")}
                  className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember Me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
