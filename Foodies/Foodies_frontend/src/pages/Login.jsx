import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setError(""); 
      console.log("Attempting login with:", formData); // Debug log
      
      const response = await api.post("/auth/login", formData);
      console.log("Login Success:", response.data); // Debug log
      
      const token = response.data.token;
      localStorage.setItem("token", token);
      alert("Login Successful!");
      navigate("/"); 
      
    } catch (err) {
      console.error("Login Error Details:", err);
      
      // LOGIC TO SHOW THE REAL ERROR
      if (err.response) {
        // The server responded (e.g., 401 Unauthorized)
        setError(`Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // The request was sent but no response (Network/CORS issue)
        setError("Network Error: No response from server. Check CORS/Ports.");
      } else {
        // Something else happened
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-500">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Enter your credentials to access Foodie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/*Email Input*/}
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              placeholder="admin@test.com"
              className="bg-zinc-800 border-zinc-700 text-white"
              onChange={handleChange}
            />
          </div>
          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="bg-zinc-800 border-zinc-700 text-white"
              onChange={handleChange}
            />
          </div>
          {/*Error Message*/}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Login Button */}
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
