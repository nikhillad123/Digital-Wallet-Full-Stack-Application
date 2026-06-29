import "./EmptyState.css";

function EmptyState({
    title,
    message,
    icon = "📭",
}) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>

            <h2>{title}</h2>

            <p>{message}</p>
        </div>
    );
}

export default EmptyState;