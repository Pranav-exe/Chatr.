import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

interface SignupInputs {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }: SignupInputs) => {
    // Trim inputs
    fullName = fullName.trim();
    username = username.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();
    gender = gender.trim();

    if (!handleInputErrors({ fullName, username, password, confirmPassword, gender })) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important if using cookies
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }: SignupInputs) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}