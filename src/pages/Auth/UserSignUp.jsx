import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import {
  isValidName,
  isValidPassword,
  isValidUsername,
  toastType,
} from "../../helper/helper";
import { useToast } from "../../components/Toast/ToastService";
import { axiosInstance } from "../../apis/axiosInstance";

export default function UserSignUp() {
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignUp = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !isValidName({ name, setFormError }) ||
      !isValidUsername({ username, setFormError }) ||
      !isValidPassword({ password, setFormError })
    ) {
      return;
    }
    if (!gender) return setFormError("Gender Field is required.");
    if (!jobTitle) return setFormError("Job Title Field is required.");
    if (!role) return setFormError("Role Field is required.");
    if (!contactNumber)
      return setFormError("Contact Number Field is required.");
    const signUpData = {
      name: name,
      username: username,
      password: password,
      role: role,
      phone_number: contactNumber,
      job_title: jobTitle,
      gender: gender,
    };
    try {
      const response = await axiosInstance.post("signup/", signUpData);
      console.log("Response:", response);
      toast.open("User SignUp successfull!", toastType.SUCCESS);
      navigate("/signin");
    } catch (error) {
      console.log("Error:", error);
      toast.open(
        error?.response?.data.message || "Error signing up user!",
        toastType.ERROR
      );
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="relative p-4 border rounded-md md:w-1/2 lg:w-2/6">
        <div className="absolute top-4 right-4 border rounded-md px-2 py-1 flex items-center gap-1 hover:bg-cutomGrey-light">
          <img
            src="src/assets/logo.png"
            alt="logoImg"
            className="h-6 w-6 object-contain"
          />
          <div className="text-sm font-semibold text-primary-light">
            MKS Vision
          </div>
        </div>

        <form onSubmit={onSignUp}>
          <p className="mb-5 text-xl font-semibold">Sign Up</p>

          <InputField
            isPasswordField={false}
            value={name}
            setValue={setName}
            placeholder="Full Name"
            label="Full Name"
            disabled={isLoading}
          />
          <InputField
            isPasswordField={false}
            value={username}
            setValue={setUsername}
            placeholder="Username"
            label="Username"
            disabled={isLoading}
          />

          <InputField
            isPasswordField={true}
            value={password}
            setValue={setPassword}
            label="Password"
            disabled={isLoading}
          />

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <InputField
                isPasswordField={false}
                value={contactNumber}
                setValue={setContactNumber}
                placeholder="Phone Number"
                label="Phone Number"
                disabled={isLoading}
              />
            </div>

            {/* Role Field */}
            <div className="flex-1 flex flex-col ">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
                className="input-box"
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {" "}
            {/* Gender Dropdown */}
            <div className="flex-1 flex flex-col ">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={isLoading}
                className="input-box"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Job Title Dropdown */}
            <div className="flex-1 flex flex-col ">
              <label className="text-sm font-medium text-gray-700">
                Job Title
              </label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                disabled={isLoading}
                className="input-box"
              >
                <option value="">Select Job Title</option>
                <option value="Python dev">Python dev</option>
                <option value="Testing">Testing</option>
                <option value="Data scientist">Data scientist</option>
                <option value="Mobile App dev">Mobile App dev</option>
                <option value="Full stack dev">Full stack dev</option>
              </select>
            </div>
          </div>
          {formError && (
            <p className="text-red-600 text-xs mb-1 mt-2">{formError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-3 w-full rounded-md font-semibold text-white p-2 transition duration-300
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-light hover:bg-primary"
                }`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-3 flex justify-center gap-2 text-sm ">
          <p>Already have an account?</p>
          <Link to="/signin" className="font-semibold text-primary-light">
            SignIn
          </Link>
        </div>
      </div>
    </div>
  );
}
