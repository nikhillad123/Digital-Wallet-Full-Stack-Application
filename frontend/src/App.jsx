import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DepositPage from "./pages/DepositPage";
import WithdrawPage from "./pages/WithdrawPage";
import TransferPage from "./pages/TransferPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminTransactionsPage from "./pages/AdminTransactionsPage";
import AuditLogsPage from "./pages/AuditLogsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={
                        <PublicLayout>
                            <LandingPage />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <PublicLayout>
                            <LoginPage />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicLayout>
                            <RegisterPage />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/forgot-password"
                    element={
                        <PublicLayout>
                            <ForgotPasswordPage />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/reset-password/:token"
                    element={
                        <PublicLayout>
                            <ResetPasswordPage />
                        </PublicLayout>
                    }
                />

                {/* Protected User Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/deposit"
                    element={
                        <ProtectedRoute>
                            <DepositPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/withdraw"
                    element={
                        <ProtectedRoute>
                            <WithdrawPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transfer"
                    element={
                        <ProtectedRoute>
                            <TransferPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePasswordPage />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Admin Routes */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedAdminRoute>
                            <AdminDashboardPage />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedAdminRoute>
                            <AdminUsersPage />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/admin/transactions"
                    element={
                        <ProtectedAdminRoute>
                            <AdminTransactionsPage />
                        </ProtectedAdminRoute>
                    }
                />

                <Route
                    path="/admin/audit-logs"
                    element={
                        <ProtectedAdminRoute>
                            <AuditLogsPage />
                        </ProtectedAdminRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;