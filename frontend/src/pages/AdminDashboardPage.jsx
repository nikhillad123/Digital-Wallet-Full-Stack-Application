import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AdminDashboardPage.css";
import { api } from "../api/api";

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();

    useEffect(() => {
        fetchAdminStats();
    }, []);

    async function fetchAdminStats() {
        try {
            const response = await api("/api/admin/stats");

            const data = await response.json();

            if (response.ok) {
                setStats(data.data);
            } else {
                showToast(
                    data.message || "Failed to load admin statistics",
                    "error"
                );
            }
        } catch (error) {
            console.error(error);
            showToast("Server Error", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-layout">
            <Sidebar />

            <main className="admin-content">

                <div className="admin-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Platform overview and statistics</p>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading">
                        Loading...
                    </div>
                ) : (
                    <div className="admin-stats">

                        <div className="admin-card">
                            <span>Total Users</span>
                            <h2>{stats.totalUsers}</h2>
                        </div>

                        <div className="admin-card">
                            <span>Total Accounts</span>
                            <h2>{stats.totalAccounts}</h2>
                        </div>

                        <div className="admin-card">
                            <span>Total Transactions</span>
                            <h2>{stats.totalTransactions}</h2>
                        </div>

                        <div className="admin-card">
                            <span>Money in System</span>
                            <h2>
                                ₹
                                {Number(
                                    stats.totalMoneyInSystem
                                ).toLocaleString("en-IN")}
                            </h2>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboardPage;