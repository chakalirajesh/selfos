import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authApi";


import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      toast.success("Login Successful");

      navigate("/dashboard");

    } catch (error: any) {
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-6">


      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-4xl font-bold text-center mb-2">
          SelfOS
        </h1>

        <p className="text-center text-slate-500 mb-8">
          Welcome back
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl w-full mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-3 rounded-xl w-full mb-6 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition disabled:bg-gray-400"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        <p className="text-center mt-6 text-slate-500">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );

}
