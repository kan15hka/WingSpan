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

export default function UserSignIn() {
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !isValidUsername({ username, setFormError }) ||
      !isValidPassword({ password, setFormError })
    ) {
      return;
    }
    const signInData = {
      username: username,
      password: password,
    };
    try {
      const response = await axiosInstance.post("signin/", signInData);
      console.log("Response:", response);
      toast.open("User SignIn successfull!", toastType.SUCCESS);

      const userData = response?.data?.user;
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.role === "Admin")
        navigate("/admin", {
          state: userData,
        });
      else
        navigate("/employee", {
          state: userData,
        });
    } catch (error) {
      console.log("Error:", error);
      toast.open(
        error?.response?.data.message || "Error signing in user!",
        toastType.ERROR
      );
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="relative p-4 border rounded-md  w-96">
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

        <form onSubmit={onSignIn}>
          <p className="mb-5 text-xl font-semibold">Sign In</p>

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
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-3 flex justify-center gap-2 text-sm ">
          <p>Don't have an account?</p>
          <Link to="/signup" className="font-semibold text-primary-light">
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}
