import { useNavigate } from "react-router-dom";

const statusEmoji = {
    pending: "⏳",
    running: "⚙️",
    completed: "✓",
    failed: "✗",
};

const statusColor = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    running: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border border-green-500/20",
    failed: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const SessionHistory = ({ sessions }) => {
    const navigate = useNavigate();

    if (!sessions || sessions.length === 0) {
        return (
            <div className="text-center text-gray-500 py-12 px-4">
                <p className="text-xs">No previous research sessions</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {sessions.map((session) => (
                <button
                    key={session._id}
                    onClick={() => navigate(`/results/${session._id}`)}
                    className="w-full p-4 text-left hover:bg-[#202022] active:bg-[#252528] border-b border-[#2d2d30] transition-colors flex items-center justify-between gap-3 group"
                >
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                            {session.topic}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                            {new Date(session.createdAt).toLocaleDateString()} •{" "}
                            {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusColor[session.status]}`}>
                        {statusEmoji[session.status]}
                    </div>
                </button>
            ))}
        </div>
    );
}

export default SessionHistory;