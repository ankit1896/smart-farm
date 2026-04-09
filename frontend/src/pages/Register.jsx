import loginImg from "../assets/login.png";
import Input from "../components/Input";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {

    const [role, setRole] = useState("customer"); // "customer" or "farmer"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert("All fields required");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // split full name
        const parts = name.split(" ");
        const firstName = parts[0];
        const lastName = parts.slice(1).join(" ");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email,
                    email: email,
                    password: password,
                    confirm_password: confirmPassword,
                    first_name: firstName,
                    last_name: lastName,
                    is_farmer: role === "farmer"
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message + ". Redirecting to login...");
                navigate("/", { state: { selectedRole: role } });
            } else {
                let errorMsg = "Registration failed. ";
                if (data.username) {
                    errorMsg += "An account with this email already exists. ";
                } else {
                    // Collect all other field errors
                    Object.keys(data).forEach(key => {
                        errorMsg += `${key}: ${data[key][0]} `;
                    });
                }
                alert(errorMsg);
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
                            {role === "customer" ? "Create Account" : "Join as Farmer"}
                        </h3>
                        <p className="text-slate-500 mb-8 font-medium">
                            {role === "customer" ? "Join our community of fresh food lovers" : "Start selling your fresh produce today"}
                        </p>

                        {/* Full Name */}
                        <Input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* Email */}
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password */}
                        <Input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Confirm Password */}
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {/* Terms */}
                        <div className="flex items-center gap-2 mb-4 text-sm">
                            <input type="checkbox" />
                            <span>
                                I agree with{" "}
                                <span className="text-blue-600 cursor-pointer">
                                    Terms & Condition
                                </span>
                            </span>
                        </div>

                        {/* Sign Up Button */}
                        <Button text="Sign Up" onClick={handleRegister} />

                        {/* OR */}
                        <div className="text-center my-4 text-gray-500">OR</div>

                        {/* Google Signup */}
                        <button className="w-full bg-white border py-3 rounded-md flex items-center justify-center gap-2">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                                className="w-5"
                                alt="google"
                            />
                            Signup With Google
                        </button>

                        {/* Sign In */}
                        <p className="text-center text-sm mt-4">
                            Already have an account?{" "}
                            <Link to="/" className="text-blue-600">
                                Sign In
                            </Link>
                        </p>

                    </div>
                </div>
            </div>

        </div>
    );
}
