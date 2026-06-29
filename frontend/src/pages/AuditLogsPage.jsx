import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AuditLogsPage.css";
import { api } from "../api/api";
import EmptyState from "../components/EmptyState";

function AuditLogsPage() {

    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [action, setAction] = useState("");

    const { showToast } = useToast();

    useEffect(() => {
        fetchAuditLogs();
    }, [page, action]);

    async function fetchAuditLogs() {

        try {

            setLoading(true);

            const query = new URLSearchParams({
                page,
                limit: 10,
            });

            if (action) {
                query.append("action", action);
            }

            const response = await api(`/api/admin/audit-logs?${query.toString()}`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setAuditLogs(data.auditLogs);
            setTotalPages(data.totalPages);

        } catch (error) {

            console.error(error);
            showToast(
                error.message || "Failed to fetch audit logs",
                "error"
            );

        } finally {

            setLoading(false);

        }

    }

    function formatAction(action) {

        switch (action) {

            case "FREEZE_USER":
                return "Freeze User";

            case "UNFREEZE_USER":
                return "Unfreeze User";

            default:
                return action;

        }

    }

    return (

        <div className="audit-layout">

            <Sidebar />

            <main className="audit-content">

                <div className="audit-header">

                    <h1>Audit Logs</h1>

                    <p>
                        Track administrative actions performed in the system.
                    </p>

                </div>

                <div className="audit-filters">

                    <select
                        value={action}
                        onChange={(e) => {
                            setPage(1);
                            setAction(e.target.value);
                        }}
                    >

                        <option value="">All Actions</option>

                        <option value="FREEZE_USER">
                            Freeze User
                        </option>

                        <option value="UNFREEZE_USER">
                            Unfreeze User
                        </option>

                    </select>

                </div>

                {loading ? (

                    <div className="audit-loading">

                        Loading...

                    </div>

                ) : auditLogs.length === 0 ? (

                    <EmptyState
                        title="No Audit Logs"
                        message="Audit events will appear here when administrative actions are recorded."
                    />

                ) : (

                    <>

                        <table className="audit-table">

                            <thead>

                                <tr>

                                    <th>Admin</th>

                                    <th>Email</th>

                                    <th>Action</th>

                                    <th>Target User</th>

                                    <th>Target Email</th>

                                    <th>Date</th>

                                </tr>

                            </thead>

                            <tbody>

                                {auditLogs.map((log) => (

                                    <tr key={log._id}>

                                        <td>

                                            {log.admin?.name || "-"}

                                        </td>

                                        <td>

                                            {log.admin?.email || "-"}

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    log.action === "FREEZE_USER"
                                                        ? "action-freeze"
                                                        : "action-unfreeze"
                                                }
                                            >

                                                {formatAction(log.action)}

                                            </span>

                                        </td>

                                        <td>

                                            {log.targetUser?.name || "-"}

                                        </td>

                                        <td>

                                            {log.targetUser?.email || "-"}

                                        </td>

                                        <td>

                                            {new Date(
                                                log.createdAt
                                            ).toLocaleDateString()}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        <div className="audit-pagination">

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

export default AuditLogsPage;