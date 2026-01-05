import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
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
  CardFooter,
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
      console.log("Attempting login with:", formData);

      const response = await api.post("/auth/login", formData);
      console.log("Login Success:", response.data);

      const token = response.data.token;
      localStorage.setItem("token", token);
      
      // Save email for Navbar logic
      localStorage.setItem("userEmail", formData.email);
      
      alert("Login Successful!");
      navigate("/");
    } catch (err) {
      console.error("Login Error Details:", err);

      if (err.response) {
        setError(
          `Server Error: ${err.response.status} - ${JSON.stringify(
            err.response.data
          )}`
        );
      } else if (err.request) {
        setError("Network Error: No response from server. Check CORS/Ports.");
      } else {
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
          
          {/* Email Input */}
          <div className="space-y-2">
            {/* Fixed: Used ShadCN Label instead of html label */}
            <Label htmlFor="email">Email</Label>
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

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Login Button */}
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </CardContent>
        
        {/* Footer Link to Register */}
        <CardFooter className="justify-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;