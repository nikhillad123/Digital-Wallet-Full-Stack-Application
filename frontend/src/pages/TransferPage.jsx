import "../styles/TransferPage.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { api } from "../api/api";

function TransferPage() {

    const [account, setAccount] = useState(null);

    const [toEmail, setToEmail] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { showToast } = useToast();

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

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

    const handleTransfer = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!toEmail || !amount) {
            setError("Please fill all fields");
            return;
        }

        if (Number(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response = await api("/api/transaction/transfer", {
                method: "POST",
                body: JSON.stringify({
                    toEmail,
                    amount: Number(amount),
                    idempotencyKey: crypto.randomUUID(),
                }),
            });

            const data = await response.json();

            if (response.status === 409) {
                setError(
                    data.message ||
                    "Duplicate transfer request blocked"
                );

                showToast(
                    data.message ||
                    "Duplicate transfer request blocked",
                    "error"
                );

                return;
            }

            if (!response.ok) {
                setError(data.message);

                showToast(
                    data.message || "Something went wrong",
                    "error"
                );

                return;
            }

            setSuccess(data.message);

            showToast(
                data.message || "Transfer successful",
                "success"
            );

            setToEmail("");
            setAmount("");

            await fetchAccount();

        } catch (error) {
            console.log(error);
            setError("Something went wrong");
            showToast(
                "Something went wrong",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transfer-page">

            <Sidebar />

            <main className="transfer-main">

                <h1>Transfer Money</h1>

                <p>
                    Welcome, {user?.name || "User"}
                </p>

                <div className="balance-card">

                    <div>
                        <p className="balance-label">
                            Available Balance
                        </p>

                        <h2 className="balance-amount">
                            ₹{account
                                ? account.balance.toFixed(2)
                                : "0.00"}
                        </h2>

                        <p className="balance-currency">
                            {account?.currency || "INR"}
                        </p>
                    </div>

                </div>

                <div className="transfer-panel">

                    <h2>Transfer Funds</h2>

                    <form onSubmit={handleTransfer}>

                        <input
                            type="email"
                            placeholder="Receiver email"
                            value={toEmail}
                            onChange={(e) =>
                                setToEmail(e.target.value)
                            }
                        />

                        <small className="helper-text">
                            Enter the email address of the wallet owner.
                        </small>

                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                        />

                        {/* {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )} */}

                        {/* {success && (
                            <p className="success-message">
                                {success}
                            </p>
                        )} */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="primary-btn"
                        >
                            {loading && (
                                <span className="button-spinner"></span>
                            )}

                            {loading
                                ? "Transferring..."
                                : "Transfer"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default TransferPage;