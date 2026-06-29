import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { api } from "../api/api";

function Sidebar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);

    const isAdmin = user?.role === "admin";
    console.log("isAdmin: ", isAdmin);

    async function handleLogout() {
        try {
            await api("/api/auth/logout", {
            method: "POST",
        });

            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">₹</div>
                <span>Wallet</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/deposit">Deposit</NavLink>
                <NavLink to="/withdraw">Withdraw</NavLink>
                <NavLink to="/transfer">Transfer</NavLink>
                <NavLink to="/history">History</NavLink>
                <NavLink to="/profile">Profile</NavLink>

                {isAdmin && (
                    <>
                        <div className="sidebar-heading">
                            Admin
                        </div>

                        <NavLink to="/admin" end>Overview</NavLink>
                        <NavLink to="/admin/users">Users</NavLink>
                        <NavLink to="/admin/transactions">Transactions</NavLink>
                        <NavLink to="/admin/audit-logs">Audit Logs</NavLink>
                    </>
                )}

                <button className="sidebar-logout" onClick={handleLogout}>
                    Logout
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;