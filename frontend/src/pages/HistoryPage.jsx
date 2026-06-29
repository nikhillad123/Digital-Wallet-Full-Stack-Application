import "../styles/HistoryPage.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import EmptyState from "../components/EmptyState";

function HistoryPage() {

    const [transactions, setTransactions] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [type, setType] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    const fetchTransactions = async (
        currentPage = page
    ) => {

        try {
            setLoading(true);

            setError("");

            const params = new URLSearchParams();

            params.append("page", currentPage);
            params.append("limit", 10);

            if (type) params.append("type", type);
            if (minAmount) params.append("minAmount", minAmount);
            if (maxAmount) params.append("maxAmount", maxAmount);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const response = await api(`/api/transaction/history?${params.toString()}`);

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setTransactions(data.transactions);
            setTotalPages(data.totalPages);

        } catch (error) {
            console.log(error);
            setError("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(page);
    }, [page]);

    const handleApplyFilters = () => {
        setPage(1);
        fetchTransactions(1);
    };

    const handleReset = () => {

        setType("");
        setMinAmount("");
        setMaxAmount("");
        setStartDate("");
        setEndDate("");

        setPage(1);

        setTimeout(() => {
            fetchTransactions(1);
        }, 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    return (
        <div className="history-page">

            <Sidebar />

            <main className="history-main">

                <h1>Transaction History</h1>

                <p>
                    Welcome, {user?.name || "User"}
                </p>

                <div className="filter-panel">

                    <h2>Filters</h2>

                    <div className="filter-grid">

                        <select
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value)
                            }
                        >
                            <option value="">
                                All Types
                            </option>

                            <option value="CREDIT">
                                Credit
                            </option>

                            <option value="DEBIT">
                                Debit
                            </option>
                        </select>

                        <input
                            type="number"
                            placeholder="Min Amount"
                            value={minAmount}
                            onChange={(e) =>
                                setMinAmount(e.target.value)
                            }
                        />

                        <input
                            type="number"
                            placeholder="Max Amount"
                            value={maxAmount}
                            onChange={(e) =>
                                setMaxAmount(e.target.value)
                            }
                        />

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                        />

                    </div>

                    <div className="filter-actions">

                        <button
                            className="primary-btn"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={handleReset}
                        >
                            Reset
                        </button>

                    </div>

                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <div className="history-panel">

                    <h2>Transactions</h2>

                    {loading ? (

                        <p>Loading...</p>

                    ) : transactions.length === 0 ? (

                        <EmptyState
                            title="No Transactions Found"
                            message="Try changing your filters or make your first transaction."
                        />

                    ) : (

                        <table>

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

                                {transactions.map((txn) => (

                                    <tr key={txn._id}>

                                        <td>
                                            {formatDate(
                                                txn.createdAt
                                            )}
                                        </td>

                                        <td>
                                            <span
                                                className={`type-badge ${txn.type.toLowerCase()}`}
                                            >
                                                {txn.type}
                                            </span>
                                        </td>

                                        <td>
                                            {txn.description}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${txn.status.toLowerCase()}`}
                                            >
                                                {txn.status}
                                            </span>
                                        </td>

                                        <td
                                            className={
                                                txn.type === "CREDIT"
                                                    ? "amount-credit"
                                                    : "amount-debit"
                                            }
                                        >
                                            ₹{txn.amount}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

                <div className="pagination">

                    <button
                        disabled={page === 1}
                        onClick={() =>
                            setPage((prev) => prev - 1)
                        }
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() =>
                            setPage((prev) => prev + 1)
                        }
                    >
                        Next
                    </button>

                </div>

            </main>

        </div>
    );
}

export default HistoryPage;