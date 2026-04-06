import loginImg from "../assets/login.png";
import Input from "../components/Input";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {

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
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);

                // optional: clear form
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

            } else {
                alert(JSON.stringify(data));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">

            {/* Main Container */}
            <div className="flex w-full max-w-6xl items-center justify-between gap-10">

                {/* Left Image */}
                <div className="hidden md:block w-1/2">
                    <img src={loginImg} alt="farm" className="w-full" />
                </div>

                {/* Right Register Card */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="bg-green-100 p-8 rounded-xl w-full max-w-md shadow-md">

                        {/* Logo */}
                        <h2 className="text-2xl font-bold text-blue-600 mb-2">
                            🌱 Smart Farm
                        </h2>

                        {/* Heading */}
                        <h3 className="text-xl font-semibold mb-1">
                            Welcome To Smartfarm
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Create New Account
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
            <Footer />
        </div>
    );
}
