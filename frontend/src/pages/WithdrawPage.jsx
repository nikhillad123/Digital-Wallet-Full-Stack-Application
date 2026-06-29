import "../styles/WithdrawPage.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { api } from "../api/api";

function WithdrawPage() {
    const [account, setAccount] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { showToast } = useToast();

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const fetchAccount = async () => {
        try {
            const response = await api("/api/account");

            const data = await response.json();

            if (!response.ok) {
                return;
            }

            setAccount(data.account);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await api("/api/transaction/withdraw", {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(amount),
                    idempotencyKey: crypto.randomUUID(),
                }),
            });

            const data = await response.json();

            if (response.status === 409) {
                setError(data.message || "Duplicate withdraw request blocked");

                showToast(
                    data.message || "Duplicate withdraw request blocked",
                    "error"
                );

                return;
            }

            if (!response.ok) {
                setError(data.message || "Something went wrong");
                showToast(
                    data.message || "Something went wrong",
                    "error"
                );

                return;
            }

            setSuccess(data.message || "Amount withdrawn successfully");
            showToast(
                data.message || "Amount withdrawn successfully",
                "success"
            );

            setAmount("");
            await fetchAccount();
        } catch (error) {
            console.log(error);
            setError("Something went wrong");
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="withdraw-page">
            <Sidebar />

            <main className="withdraw-main">
                <h1>Withdraw Money</h1>

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
                </div>

                <div className="withdraw-panel">
                    <h2>Withdraw Funds</h2>

                    <form onSubmit={handleWithdraw}>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        {/* {error && <p className="error-message">{error}</p>} */}

                        {/* {success && <p className="success-message">{success}</p>} */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="primary-btn"
                        >
                            {loading && (
                                <span className="button-spinner"></span>
                            )}

                            {loading ? "Withdrawing..." : "Withdraw"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default WithdrawPage;