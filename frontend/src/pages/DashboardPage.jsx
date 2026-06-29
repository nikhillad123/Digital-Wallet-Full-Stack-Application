import "../styles/DashboardPage.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import EmptyState from "../components/EmptyState";

const user = JSON.parse(localStorage.getItem("user")) || {};

function DashboardPage() {
    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [stats, setStats] = useState({
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalTransfers: 0,
        transactionCount: 0
    });

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await api("/api/account");

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.message);
                    return;
                }

                console.log(data);

                setAccount(data.account);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await api("/api/transaction/history");

                const data = await response.json();

                console.log(data);

                if (!response.ok) {
                    return;
                }

                setTransactions(data.transactions || []);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchDashboardStats = async () => {
            try {
                const response = await api("/api/transaction/dashboard");

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.message);
                    return;
                }

                console.log(data);

                setStats(data.stats);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAccount();
        fetchTransactions();
        fetchDashboardStats();
    }, []);

    return (
        <div className="dashboard-page">
            <Sidebar />

            <main className="dashboard-main">
                <h1>Dashboard</h1>

                <p>Welcome, {user?.name || "User"}</p>

                <div className="balance-card">
                    <div>
                        <p className="balance-label">Available Balance</p>

                        <h2 className="balance-amount">
                            ₹{account ? account.balance.toFixed(2) : "0.00"}
                        </h2>

                        <p className="balance-currency">
                            {account?.currency || "INR"}
                        </p>
                    </div>

                    <div className="balance-actions">
                        <button
                            className="primary-btn"
                            onClick={() => navigate("/deposit")}
                        >
                            Deposit
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/withdraw")}
                        >
                            Withdraw
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/transfer")}
                        >
                            Transfer
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <p>Total Deposits</p>
                        <h3>₹{stats.totalDeposits.toFixed(2)}</h3>
                    </div>

                    <div className="stat-card">
                        <p>Total Withdrawals</p>
                        <h3>₹{stats.totalWithdrawals.toFixed(2)}</h3>
                    </div>

                    <div className="stat-card">
                        <p>Total Transfers</p>
                        <h3>₹{stats.totalTransfers.toFixed(2)}</h3>
                    </div>

                    <div className="stat-card">
                        <p>Transactions</p>
                        <h3>{stats.transactionCount}</h3>
                    </div>
                </div>

                <div className="transactions-panel">
                    <div className="panel-header">
                        <h2>Recent Transactions</h2>
                    </div>

                    {transactions.length === 0 ? (
                        <EmptyState
                            title="No Recent Transactions"
                            message="Your recent deposits, withdrawals and transfers will appear here."
                        />
                    ) : (
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.slice(0, 5).map((txn) => (
                                    <tr key={txn._id}>
                                        <td>{new Date(txn.createdAt).toLocaleDateString()}</td>

                                        <td>{txn.type}</td>

                                        <td>{txn.description}</td>

                                        <td>{txn.status}</td>

                                        <td
                                            className={
                                                txn.type === "CREDIT"
                                                    ? "amount-credit"
                                                    : "amount-debit"
                                            }
                                        >
                                            {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;