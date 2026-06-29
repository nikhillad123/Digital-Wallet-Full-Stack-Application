import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <span className="footer-copy">
                © 2026 ₹ Wallet
            </span>

            <div className="footer-links">
                <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    GitHub
                </a>

                <a
                    href="https://linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    LinkedIn
                </a>

                <a
                    href="/"
                >
                    Resume
                </a>
            </div>
        </footer>
    );
}

export default Footer;