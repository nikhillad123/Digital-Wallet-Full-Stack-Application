import "../styles/RegisterPage.css";
import Footer from "../components/Footer";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

function RegisterPage() {


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        setError("");
        setSuccess("");


        const { name, email, password, confirmPassword } = formData;


        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }


        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }


        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const response = await api("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });


            const data = await response.json();


            if (!response.ok) {
                setError(data.message);
                return;
            }


            setSuccess(
                "Account created successfully. You can now sign in to your wallet."
            );


            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });


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

                    {success ? (
                        <div className="auth-success-state">
                            <h2 className="success-title">
                                Account Created
                            </h2>

                            <p className="success-text">
                                Your wallet account has been created successfully.
                                You can now sign in and access your dashboard.
                            </p>

                            <Link
                                to="/login"
                                className="success-button"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <form className="auth-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">NAME</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>


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
                                    <label htmlFor="password">PASSWORD</label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="confirmPassword">
                                        CONFIRM PASSWORD
                                    </label>


                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
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

                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </button>
                            </form>


                            <p className="auth-footer">
                                Already have an account?{" "}
                                <Link to="/login">Log in</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}


export default RegisterPage;