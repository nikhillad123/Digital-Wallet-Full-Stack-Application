import "../styles/ProfilePage.css";
import { useToast } from "../context/ToastContext";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";

function ProfilePage() {
    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { showToast } = useToast();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchAccount();
    }, []);

    async function fetchAccount() {
        try {
            setLoading(true);

            const response = await api("/api/account");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load account"
                );
            }

            setAccount(data.account);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {

            const response = await api("/api/auth/logout", {
                method: "POST"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Logout failed"
                );
            }

            localStorage.removeItem("user");

            navigate("/login");

        } catch (error) {
            showToast(
                error.message || "Something went wrong",
                "error"
            );
        }
    }

    return (
        <div className="profile-layout">

            {/* Sidebar */}

            <Sidebar />

            {/* Main */}

            <main className="profile-main">

                <div className="profile-header">

                    <h1>Profile</h1>

                    <p>
                        Welcome,
                        {" "}
                        {user?.name}
                    </p>

                </div>

                {loading && (
                    <div className="profile-card">
                        Loading...
                    </div>
                )}

                {error && (
                    <div className="profile-card error-card">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Profile Information */}

                        <div className="profile-card">

                            <h2>
                                Profile Information
                            </h2>

                            <div className="info-row">
                                <span>Name</span>
                                <strong>
                                    {user?.name}
                                </strong>
                            </div>

                            <div className="info-row">
                                <span>Email</span>
                                <strong>
                                    {user?.email}
                                </strong>
                            </div>

                            <div className="info-row">
                                <span>Role</span>
                                <strong>
                                    {user?.role}
                                </strong>
                            </div>

                        </div>

                        {/* Account Information */}

                        <div className="profile-card">

                            <h2>
                                Account Information
                            </h2>

                            <div className="info-row">
                                <span>Balance</span>

                                <strong className="money">
                                    ₹
                                    {account?.balance?.toFixed(2)}
                                </strong>
                            </div>

                            <div className="info-row">
                                <span>Currency</span>

                                <strong>
                                    {account?.currency}
                                </strong>
                            </div>

                        </div>

                        {/* Security */}

                        <div className="profile-card">

                            <h2>Security</h2>

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    navigate(
                                        "/change-password"
                                    )
                                }
                            >
                                Change Password
                            </button>

                        </div>

                        {/* Session

                        <div className="profile-card">

                            <h2>Session</h2>

                            <button
                                className="danger-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div> */}
                    </>
                )}

            </main>

        </div>
    );
}

export default ProfilePage;