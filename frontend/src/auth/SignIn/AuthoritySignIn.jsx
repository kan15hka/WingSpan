import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import {
  isValidUsername,
  isValidPassword,
  toastType,
} from "../../helper/helper";
import { useToast } from "../../components/Toast/ToastService";
import { authoritySignIn } from "../../apis/authorityAuthApi";
import { useAuth } from "../../context/AuthContext";

export default function AuthoritySignIn() {
  const navigate = useNavigate();
  const toast = useToast();
  const { loadUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onAuthoritySignIn = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setError("");
    if (
      !isValidUsername({ username, setError }) ||
      !isValidPassword({ password, setError })
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const responseData = await authoritySignIn({
        username: username.toLowerCase().trim(),
        password,
      });

      const userResponse = {
        id: responseData.id,
        name: responseData.name,
        username: responseData.username,
        role: responseData.role,
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
      };

      loadUser(userResponse);
      toast.open(
        responseData?.message || "Login successful",
        toastType.SUCCESS
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      toast.open(
        error?.response?.data?.message || "Login failed",
        toastType.ERROR
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="relative p-4 border rounded-md w-96">
        <div className="absolute top-4 right-4 border rounded-md px-2 py-1 flex items-center gap-1 hover:bg-cutomGrey-light">
          <div>
            <img
              src="/images/logo.webp"
              alt="logoImg"
              className="h-6 w-6 object-contain"
            />
          </div>
          <div className="text-sm font-semibold text-primary-light">
            WingSpan
          </div>
        </div>

        <form onSubmit={onAuthoritySignIn}>
          <p className="mb-5 text-xl font-semibold">Authorised Login</p>

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
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-3 text-gray-500 text-center text-xs mx-auto">
          <p>
            Unauthorized access can lead to <br /> security breaches and
            unintended consequences.
          </p>
        </div>
      </div>
    </div>
  );
}
