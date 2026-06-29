import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ForgotPasswordPage.css";
import { api } from "../api/api";

function ForgotPasswordPage() {

    const [email, setEmail] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email) {
            return setError(
                "Please enter your email"
            );
        }

        try {

            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await api("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({
                    email
                })
            });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Something went wrong"
                );
            }

            setSuccess(data.message);

            setEmail("");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="forgot-container">

            <div className="forgot-card">

                <div className="auth-brand">
                    <span className="auth-logo">
                        ₹
                    </span>

                    <span>
                        Wallet
                    </span>
                </div>

                <h1>
                    Forgot Password
                </h1>

                <p className="subtitle">
                    Enter your email and we'll
                    send you a reset link.
                </p>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading && (
                            <span className="button-spinner"></span>
                        )}

                        {loading
                            ? "Sending Reset Link..."
                            : "Send Reset Link"}
                    </button>

                </form>

                <div className="auth-footer">

                    Remember your password?

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ForgotPasswordPage;