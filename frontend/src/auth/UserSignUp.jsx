import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast/ToastService";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import {
  isValidName,
  isValidPassword,
  isValidUsername,
  toastType,
} from "../helper/helper";
import { formatDate } from "../helper/formatter";
import { passengerSignUp } from "../apis/passengerApi";

export default function UserSignUp() {
  const navigate = useNavigate();
  const toast = useToast();
  const { loadUser } = useAuth();

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !isValidName({ name, setError }) ||
      !isValidUsername({ username, setError }) ||
      !isValidPassword({ password, setError })
    ) {
      return;
    }
    if (!gender) return setError("Gender Field is required.");
    if (!nationality) return setError("Nationality Field is required.");
    if (!dob) return setError("Date of Birth Field is required.");
    if (!contactNumber) return setError("Contact Number Field is required.");

    const userSignUpData = {
      username: username,
      password: password,
      name: name,
      dob: formatDate(dob),
      nationality: nationality,
      gender: gender,
      contact_number: contactNumber,
    };
    console.log(userSignUpData);

    setIsLoading(true);
    try {
      const responseData = await passengerSignUp(userSignUpData);

      const userResponse = {
        id: responseData.id,
        name: responseData.name,
        username: responseData.username,
        role: "user",
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
      };

      loadUser(userResponse);
      toast.open(
        responseData?.message || "SignUp successful",
        toastType.SUCCESS
      );
      navigate("/");
    } catch (error) {
      console.error("SignUp error:", error);

      toast.open(
        error?.response?.data?.message || "SignUp failed",
        toastType.ERROR
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="relative p-4 border rounded-md md:w-1/2 lg:w-2/6">
        <div className="absolute top-4 right-4 border rounded-md px-2 py-1 flex items-center gap-1 hover:bg-cutomGrey-light">
          <img
            src="/images/logo.webp"
            alt="logoImg"
            className="h-6 w-6 object-contain"
          />
          <div className="text-sm font-semibold text-primary-light">
            WingSpan
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

            {/* Date of Birth (DOB) Field */}
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 ">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={isLoading}
                className="input-box"
              />
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
            {/* Nationality Dropdown */}
            <div className="flex-1 flex flex-col ">
              <label className="text-sm font-medium text-gray-700">
                Nationality
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                disabled={isLoading}
                className="input-box"
              >
                <option value="">Select Nationality</option>
                <option value="USA">USA</option>
                <option value="India">India</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
          {error && <p className="text-red-600 text-xs mb-1 mt-2">{error}</p>}

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
          <Link
            to="/passenger-signin"
            className="font-semibold text-primary-light"
          >
            SignIn
          </Link>
        </div>
      </div>
    </div>
  );
}
