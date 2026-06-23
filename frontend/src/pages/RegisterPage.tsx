import { useState } from "react";
import API from "../api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!fullName.trim()) {
            toast.error("Full Name is required");
            return;
        }

        if (!email.trim()) {
            toast.error("Email is required");
            return;
        }

        if (!password.trim()) {
            toast.error("Password is required");
            return;
        }
        try {

            await API.post("/register", {
                fullName,
                email,
                password
            });

            toast.success("Registration Successful");
            navigate("/login");

        } catch (error: any) {

            console.log(error);

            if (error.response) {
                console.log(error.response.data);
            }

            toast.error("Registration Failed");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-6">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

                <h1 className="text-4xl font-bold text-center mb-2">
                    SelfOS
                </h1>

                <p className="text-center text-slate-500 mb-8">
                    Create your account
                </p>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border border-gray-300 p-3 rounded-xl w-full mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

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
                    onClick={handleRegister}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition"
                >
                    Register
                </button>
                <p className="text-center mt-6 text-slate-500">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>
            </div>

        </div>
    );

}