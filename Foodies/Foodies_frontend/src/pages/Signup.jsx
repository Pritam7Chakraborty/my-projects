import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" // Default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    // Basic Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      setError("");
      await registerUser(formData);
      alert("Registration Successful! Please Login.");
      navigate("/login"); // Redirect to Login page
    } catch (err) {
      console.error("Signup Failed:", err);
      // Check if backend sent a specific error message
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : "Registration failed. Try again.");
      } else {
        setError("Registration failed. Server might be offline.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 px-4 pt-16">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-500">Create Account</CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Join Foodie today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="John Doe" 
              className="bg-zinc-800 border-zinc-700 text-white"
              onChange={handleChange}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              placeholder="user@test.com" 
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            onClick={handleSignup}
          >
            Sign Up
          </Button>

        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-sm text-zinc-400">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-400 hover:underline">Log in</Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;