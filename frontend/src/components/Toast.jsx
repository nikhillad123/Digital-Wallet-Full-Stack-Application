import "./Toast.css";

function Toast({ message, type, show }) {

    if (!show) return null;

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
}

export default Toast;