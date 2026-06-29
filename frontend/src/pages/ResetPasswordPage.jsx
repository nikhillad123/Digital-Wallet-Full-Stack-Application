import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { api } from "../api/api";
import "../styles/ResetPasswordPage.css";

function ResetPasswordPage() {

    const navigate = useNavigate();

    const { token } = useParams();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { showToast } = useToast();

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!newPassword || !confirmPassword) {
            return setError(
                "Please fill all fields"
            );
        }

        if (newPassword !== confirmPassword) {
            return setError(
                "Passwords do not match"
            );
        }

        try {

            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await api(`/api/auth/reset-password/${token}`, {
                method: "PATCH",
                body: JSON.stringify({
                    newPassword
                })
            });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to reset password"
                );
            }

            setSuccess(data.message);

            setTimeout(() => {

                navigate("/login");

            }, 2000);

        } catch (error) {

            setError(error.message);

            showToast(
                error.message || "Failed to reset password",
                "error"
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="reset-container">

            <div className="reset-card">

                <div className="auth-brand">

                    <span className="auth-logo">
                        ₹
                    </span>

                    <span>
                        Wallet
                    </span>

                </div>

                <h1>
                    Reset Password
                </h1>

                <p className="subtitle">
                    Create a new password for
                    your account.
                </p>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
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
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading && (
                            <span className="button-spinner"></span>
                        )}

                        {loading
                            ? "Resetting Password..."
                            : "Reset Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ResetPasswordPage;