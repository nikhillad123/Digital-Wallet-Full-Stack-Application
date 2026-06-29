import "../styles/RegisterPage.css";
import Footer from "../components/Footer";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const { email, password } = formData;

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const response = await api("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            console.log(data);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-brand">
                        <div className="auth-logo">₹</div>
                        <span>Wallet</span>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="auth-title">
                            Welcome Back
                        </h2>

                        <p className="auth-subtitle">
                            Sign in to access your wallet
                        </p>

                        <div className="form-group">
                            <label htmlFor="email">EMAIL</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                PASSWORD
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading && <span className="button-spinner"></span>}

                            {loading ? "Signing In..." : "Log In"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </p>

                    <p className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/register">
                            Register
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default LoginPage;