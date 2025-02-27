import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast/ToastService";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import { passengerSignIn } from "../apis/passengerApi";
import { isValidPassword, isValidUsername, toastType } from "../helper/helper";

export default function UserSignIn() {
  const navigate = useNavigate();
  const toast = useToast();
  const { loadUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !isValidUsername({ username, setError }) ||
      !isValidPassword({ password, setError })
    ) {
      return;
    }
    const userSignInData = {
      username: username,
      password: password,
    };
    console.log(userSignInData);

    setIsLoading(true);
    try {
      const responseData = await passengerSignIn(userSignInData);

      const userResponse = {
        name: responseData.name,
        id: responseData.id,
        username: responseData.username,
        role: "user",
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
      };
      console.log(userResponse);
      loadUser(userResponse);
      toast.open(
        responseData?.message || "SignIn successful",
        toastType.SUCCESS
      );
      navigate("/");
    } catch (error) {
      console.error("SignIn error:", error);

      toast.open(
        error?.response?.data?.message || "SignIn failed",
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

          {error && <p className="text-red-600 text-xs mb-2">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 w-full rounded-md font-semibold text-white p-2 transition duration-300
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
          <Link
            to="/passenger-signup"
            className="font-semibold text-primary-light"
          >
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}
