import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AdminUsersPage.css";
import { api } from "../api/api";
import EmptyState from "../components/EmptyState";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { showToast } = useToast();

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    async function fetchUsers(currentPage) {
        try {
            setLoading(true);

            const response = await api(
                `/api/admin/users?page=${currentPage}&limit=10`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
            showToast(
                error.message || "Failed to fetch users",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    async function freezeUser(userId) {
        try {
            const response = await api(`/api/admin/users/${userId}/freeze`, {
                method: "PATCH",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            await fetchUsers(page);

            showToast(
                "User frozen successfully.",
                "success"
            );

        } catch (error) {
            console.error(error);
            showToast(error.message || "Something went wrong", "error");
        }
    }

    async function unfreezeUser(userId) {
        try {
            const response = await api(`/api/admin/users/${userId}/unfreeze`, {
                method: "PATCH",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            await fetchUsers(page);

            showToast(
                "User unfrozen successfully.",
                "success"
            );

        } catch (error) {
            console.error(error);
            showToast(error.message || "Something went wrong", "error");
        }
    }

    return (
        <div className="admin-users-layout">

            <Sidebar />

            <main className="admin-users-content">

                <div className="admin-users-header">
                    <h1>User Management</h1>

                    <p>
                        View, freeze and unfreeze wallet users.
                    </p>
                </div>

                {loading ? (

                    <div className="admin-users-loading">
                        Loading...
                    </div>

                ) : users.length === 0 ? (

                    <EmptyState
                        title="No Users Found"
                        message="Users will appear here after they register."
                    />

                ) : (

                    <>
                        <table className="admin-users-table">

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {users.map((user) => (

                                    <tr key={user._id}>

                                        <td>{user.name}</td>

                                        <td>{user.email}</td>

                                        <td>
                                            <span
                                                className={
                                                    user.role === "admin"
                                                        ? "role-admin"
                                                        : "role-user"
                                                }
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    user.isFrozen
                                                        ? "status-frozen"
                                                        : "status-active"
                                                }
                                            >
                                                {user.isFrozen
                                                    ? "Frozen"
                                                    : "Active"}
                                            </span>

                                        </td>

                                        <td>

                                            {user.role === "admin" ? (

                                                <span className="self-admin">
                                                    —
                                                </span>

                                            ) : user.isFrozen ? (

                                                <button
                                                    className="unfreeze-btn"
                                                    onClick={() =>
                                                        unfreezeUser(user._id)
                                                    }
                                                >
                                                    Unfreeze
                                                </button>

                                            ) : (

                                                <button
                                                    className="freeze-btn"
                                                    onClick={() =>
                                                        freezeUser(user._id)
                                                    }
                                                >
                                                    Freeze
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        <div className="admin-pagination">

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

export default AdminUsersPage;