import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/authApi";
import MainLayout from "../layouts/MainLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("/login", {
        email,
        password,
      });

      console.log("SUCCESS", response.data);

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      navigate("/dashboard");

    } catch (error: any) {

      console.log("FULL ERROR", error);

      if (error.response) {
        console.log("STATUS", error.response.status);
        console.log("DATA", error.response.data);
      }

      alert("Login Failed");
    }
  };

  return (
    <MainLayout>
      <div>
        <h1>SelfOS Login</h1>

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

        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </MainLayout>
  );
}
