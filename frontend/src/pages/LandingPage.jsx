import "../styles/LandingPage.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <>
            <section className="hero">

                <div className="hero-content">
                    <p className="hero-tag">
                        JWT • REFRESH TOKENS • RBAC • NODE • EXPRESS • MONGODB
                    </p>

                    <h1>
                        A wallet backend built like
                        <br />
                        it has <span>real money</span> in it.
                    </h1>

                    <p className="hero-description">
                        Atomic transactions, refresh token rotation, audit logs,
                        role-based access control and secure money transfers.
                    </p>

                    <div className="hero-buttons">
                        <button onClick={() => navigate("/register")}>
                            Create Account
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                window.open("http://localhost:3000/api-docs", "_blank")
                            }
                        >
                            View API
                        </button>
                    </div>
                </div>

                <div className="wallet-preview">
                    <div className="wallet-card">

                        <div className="wallet-top">
                            <span>WALLET • #A19F-2201</span>
                        </div>

                        <div className="wallet-header">
                            <p>Available Balance</p>
                            <h2>₹12,500.00</h2>
                        </div>

                        <div className="transaction">
                            <div>
                                <p className="transaction-title">Transfer to Nikhil</p>
                                <p className="transaction-date">Jun 21, 09:14</p>
                            </div>

                            <span className="negative">-₹1,200</span>
                        </div>

                        <div className="transaction">
                            <div>
                                <p className="transaction-title">Salary Deposit</p>
                                <p className="transaction-date">Jun 20, 18:02</p>
                            </div>

                            <span className="positive">+₹25,000</span>
                        </div>

                        <div className="transaction">
                            <div>
                                <p className="transaction-title">Transfer from Yashvi</p>
                                <p className="transaction-date">Jun 18, 21:55</p>
                            </div>

                            <span className="positive">+₹800</span>
                        </div>

                        <div className="transaction">
                            <div>
                                <p className="transaction-title">Withdraw to Bank</p>
                                <p className="transaction-date">Jun 19, 11:40</p>
                            </div>

                            <span className="pending">PENDING</span>
                        </div>

                    </div>
                </div>

            </section>

            <section className="features-section">
                <p className="section-tag">CAPABILITIES</p>

                <h2 className="section-title">
                    Engineering features behind the wallet
                </h2>

                <div className="features-grid">

                    <div className="feature-card">
                        <h3>JWT Authentication</h3>
                        <p>
                            Access tokens, refresh tokens and secure session management.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Refresh Token Rotation</h3>
                        <p>
                            Long-lived sessions with secure token renewal and rotation.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Role-Based Access</h3>
                        <p>
                            Admin and user permissions enforced throughout the application.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Atomic Transfers</h3>
                        <p>
                            MongoDB transactions ensure money is never lost mid-transfer.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Transaction History</h3>
                        <p>
                            Complete transaction records with filtering and search support.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Transaction Receipts</h3>
                        <p>
                            Dedicated receipt pages for every successful transaction.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Freeze / Unfreeze Users</h3>
                        <p>
                            Administrators can instantly restrict account activity.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>Audit Logs</h3>
                        <p>
                            Every administrative action is recorded and traceable.
                        </p>
                    </div>

                </div>
            </section>

            <section className="security">
                <div className="security-content">
                    <p className="section-label">SECURITY & RELIABILITY</p>

                    <h2 className="section-title">
                        Engineered for trust and resilience
                    </h2>

                    <div className="security-list">
                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Password Hashing</h4>
                                <p>Passwords are hashed using bcrypt before storage.</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Refresh Token Rotation</h4>
                                <p>Long-lived sessions without exposing user credentials.</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Secure Cookies</h4>
                                <p>Authentication tokens are stored in httpOnly cookies.</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Rate Limiting</h4>
                                <p>Protects authentication endpoints from abuse.</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Atomic Transfers</h4>
                                <p>MongoDB transactions ensure balance consistency.</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Idempotency Protection</h4>
                                <p>Duplicate payment requests cannot execute twice.</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Audit Logs</h4>
                                <p>Administrative actions are permanently recorded.</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-dot"></div>
                            <div>
                                <h4>Centralized Error Handling</h4>
                                <p>Consistent API responses across the entire platform.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="security-card">
                    <div className="security-card-header">
                        <div>
                            <span>AUTH FLOW</span>
                            <p>How authentication is secured across the platform</p>
                        </div>

                        <div className="security-badge">
                            ACTIVE
                        </div>
                    </div>

                    <div className="security-flow">
                        <div className="flow-step">User Login</div>

                        <div className="flow-arrow">↓</div>

                        <div className="flow-step">
                            Access Token
                            <span>15 Minutes</span>
                        </div>

                        <div className="flow-arrow">↓</div>

                        <div className="flow-step">
                            Refresh Token
                            <span>7 Days</span>
                        </div>

                        <div className="flow-arrow">↓</div>

                        <div className="flow-step">Token Rotation</div>

                        <div className="flow-arrow">↓</div>

                        <div className="flow-step">Secure Cookies</div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default LandingPage;