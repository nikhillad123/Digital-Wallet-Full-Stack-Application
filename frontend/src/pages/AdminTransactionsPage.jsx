import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AdminTransactionsPage.css";
import { api } from "../api/api";
import EmptyState from "../components/EmptyState";

function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [type, setType] = useState("");
    const [status, setStatus] = useState("");

    const { showToast } = useToast();

    useEffect(() => {
        fetchTransactions();
    }, [page, type, status]);

    async function fetchTransactions() {
        try {
            setLoading(true);

            const query = new URLSearchParams({
                page,
                limit: 10,
            });

            if (type) query.append("type", type);
            if (status) query.append("status", status);

            const response = await api(
                `/api/admin/transactions?${query.toString()}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            showToast(
                error.message || "Failed to fetch transactions",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-transactions-layout">

            <Sidebar />

            <main className="admin-transactions-content">

                <div className="admin-transactions-header">

                    <h1>Transaction Management</h1>

                    <p>
                        View and monitor every transaction in the system.
                    </p>

                </div>

                <div className="transaction-filters">

                    <select
                        value={type}
                        onChange={(e) => {
                            setPage(1);
                            setType(e.target.value);
                        }}
                    >
                        <option value="">All Types</option>
                        <option value="CREDIT">Credit</option>
                        <option value="DEBIT">Debit</option>
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setPage(1);
                            setStatus(e.target.value);
                        }}
                    >
                        <option value="">Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILED">Failed</option>
                        <option value="REVERSED">Reversed</option>
                    </select>

                </div>

                {loading ? (

                    <div className="admin-transactions-loading">
                        Loading...
                    </div>

                ) : transactions.length === 0 ? (

                    <EmptyState
                        title="No Transactions Found"
                        message="Transactions will appear here once users start using the wallet."
                    />

                ) : (

                    <>

                        <table className="admin-transactions-table">

                            <thead>

                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>

                            </thead>

                            <tbody>

                                {transactions.map((transaction) => (

                                    <tr key={transaction._id}>

                                        <td>
                                            {transaction.user?.name || "-"}
                                        </td>

                                        <td>
                                            {transaction.user?.email || "-"}
                                        </td>

                                        <td>
                                            {transaction.description || "-"}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    transaction.type === "CREDIT"
                                                        ? "type-credit"
                                                        : "type-debit"
                                                }
                                            >
                                                {transaction.type}
                                            </span>

                                        </td>

                                        <td className="transaction-amount">

                                            ₹
                                            {transaction.amount.toLocaleString(
                                                "en-IN"
                                            )}

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    transaction.status === "SUCCESS"
                                                        ? "status-success"
                                                        : transaction.status === "PENDING"
                                                            ? "status-pending"
                                                            : transaction.status === "FAILED"
                                                                ? "status-failed"
                                                                : "status-reversed"
                                                }
                                            >
                                                {transaction.status}
                                            </span>

                                        </td>

                                        <td>
                                            {new Date(
                                                transaction.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        <div className="admin-transactions-pagination">

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

                    </>

                )}

            </main>

        </div>
    );
}

export default AdminTransactionsPage;