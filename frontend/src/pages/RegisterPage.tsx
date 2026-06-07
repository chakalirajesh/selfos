import { useState } from "react";
import API from "../api/authApi";
import MainLayout from "../layouts/MainLayout";

export default function RegisterPage() {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {

            const response = await API.post("/register", {
                fullName,
                email,
                password
            });

            console.log(response.data);

            alert("Registration Successful");

        } catch (error: any) {

            console.log(error);

            if (error.response) {
                console.log(error.response.data);
            }

            alert("Registration Failed");
        }
    };

    return (
        <MainLayout>
            <div>
                <h1>SelfOS Register</h1>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br />

                <button onClick={handleRegister}>
                    Register
                </button>
            </div>
        </MainLayout>
    );
}