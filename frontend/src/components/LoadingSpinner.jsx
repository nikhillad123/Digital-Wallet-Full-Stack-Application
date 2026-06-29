import "./LoadingSpinner.css";

function LoadingSpinner({ text = "Loading..." }) {
    return (
        <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>{text}</p>
        </div>
    );
}

export default LoadingSpinner;