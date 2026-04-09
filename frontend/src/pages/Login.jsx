import loginImg from "../assets/login.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";




export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [role, setRole] = useState(location.state?.selectedRole || "customer"); // "customer" or "farmer"

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
    }, [isAuthenticated, navigate]);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Google Token:", tokenResponse);
            try {
                const response = await fetch("http://localhost:8000/api/social/login/google/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        access_token: tokenResponse.access_token,
                    }),
                });

                const data = await response.json();
                console.log("Backend Google Login Response:", data);
                if (response.ok) {
                    login(data.access_token || data.access, { ...data.user, selectedRole: role });
                    localStorage.removeItem("cart"); // Clear old guest cart
                    alert("Google Login successful");
                    navigate(role === "farmer" ? "/farmer/dashboard" : "/home");
                } else {
                    console.error("Backend Error Detail:", data);
                    alert(`Backend authentication failed: ${JSON.stringify(data)}`);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                alert("Could not connect to backend");
            }
        },
        onError: () => alert("Google Login Failed"),
    });

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access, { ...data.user, selectedRole: role });
                localStorage.setItem("refresh_token", data.refresh);
                localStorage.removeItem("cart");

                alert("Login successful");
                navigate(role === "farmer" ? "/farmer/dashboard" : "/home");
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
            <div className="flex w-full max-w-6xl items-center justify-between gap-10">
                <div className="hidden md:block w-1/2">
                    <img src={loginImg} alt="farm" className="w-full" />
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl shadow-blue-900/5 border border-slate-100">
                        <h2 className="text-2xl font-black text-blue-600 mb-6 flex items-center gap-2">
                            🌱 <span className="tracking-tight">SmartFarm</span>
                        </h2>

                        {/* Role Selector */}
                        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                            <button 
                                onClick={() => setRole("customer")}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    role === "customer" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Customer
                            </button>
                            <button 
                                onClick={() => setRole("farmer")}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    role === "farmer" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Farmer
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
                            {role === "customer" ? "Welcome Back" : "Farmer Portal"}
                        </h3>
                        <p className="text-slate-500 mb-8 font-medium">
                            {role === "customer" ? "Login to your customer account" : "Manage your farm and sales"}
                        </p>

                        {/* Email */}
                        <Input type="email" placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password */}
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Forgot */}
                        <div className="text-right mb-4">
                            <a href="#" className="text-sm text-blue-500">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <Button text="Log In" onClick={handleLogin} />

                        {/* OR */}
                        <div className="text-center my-4 text-gray-500">OR</div>

                        {/* Google Login */}
                        <button
                            onClick={() => googleLogin()}
                            className="w-full bg-white border py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                                className="w-5"
                                alt="google"
                            />
                            Login With Google
                        </button>

                        {/* Signup */}
                        <p className="text-center text-sm mt-4">
                            Don’t have account?{" "}
                            <Link to="/register" className="text-blue-600">
                                Sign Up
                            </Link>
                        </p>

                    </div>
                </div>
            </div>

        </div>
    );
}