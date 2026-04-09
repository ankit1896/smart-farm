import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const decodeAndSetUser = (tokenStr) => {
        if (!tokenStr) {
            setUser(null);
            return;
        }
        try {
            const decoded = jwtDecode(tokenStr);
            // Priority: first_name -> first word of fullname -> username -> email
            const name = (decoded.first_name && decoded.first_name.trim()) || 
                         (decoded.fullname ? decoded.fullname.trim().split(' ')[0] : null) || 
                         (decoded.username && decoded.username.trim()) || 
                         (decoded.email ? decoded.email.split('@')[0] : "User");
            setUser({ ...decoded, displayName: name, selectedRole: decoded.selectedRole || "customer" });
        } catch (error) {
            console.warn("Invalid token format, but token exists. Using fallback.");
            setUser({ displayName: "User" });
        }
    };

    useEffect(() => {
        if (token) {
            const savedUser = localStorage.getItem("user_profile");
            if (savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    const name = (parsedUser.first_name && parsedUser.first_name.trim()) || 
                                 (parsedUser.fullname ? parsedUser.fullname.trim().split(' ')[0] : null) || 
                                 (parsedUser.username && parsedUser.username.trim()) || 
                                 (parsedUser.email ? parsedUser.email.split('@')[0] : "User");
                    setUser({ ...parsedUser, displayName: name, selectedRole: parsedUser.selectedRole || "customer" });
                } catch (e) {
                    decodeAndSetUser(token);
                }
            } else {
                decodeAndSetUser(token);
            }
        } else {
            setUser(null);
        }
        setLoading(false);

        // Listen for storage changes from other tabs
        const handleStorageChange = () => {
            const newToken = localStorage.getItem("access_token");
            if (newToken !== token) {
                setToken(newToken);
                decodeAndSetUser(newToken);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [token]);

    const login = (newToken, userData = null) => {
        localStorage.setItem("access_token", newToken);
        if (userData) {
            localStorage.setItem("user_profile", JSON.stringify(userData));
        }
        setToken(newToken);
        if (userData) {
            // Priority: first_name -> first word of fullname -> username -> email
            let name = (userData.first_name && userData.first_name.trim()) || 
                         (userData.fullname ? userData.fullname.trim().split(' ')[0] : null) || 
                         (userData.username && userData.username.trim()) || 
                         (userData.email ? userData.email.split('@')[0] : "User");
            setUser({ ...userData, displayName: name, selectedRole: userData.role || userData.selectedRole || "customer" });
        } else {
            decodeAndSetUser(newToken);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_profile");
        setToken(null);
        setUser(null);
        // Dispatch event for components not using context (if any)
        window.dispatchEvent(new Event("auth-change"));
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
