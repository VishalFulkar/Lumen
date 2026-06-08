import { useResearchStore } from "../store/researchStore";

const agentLabels = {
    search: "🔍 Search",
    reader: "📖 Reader",
    summarizer: "✂️ Summarizer",
    synthesizer: "🔗 Synthesizer",
    citation: "✓ Citation",
    graph: "🕸️ Graph",
    supervisor: "👨‍💼 Supervisor",
};

const statusIcons = {
    started: "⏳",
    progress: "⌛",
    completed: "✓",
    failed: "✗",
};

const statusBgColors = {
    started: "bg-yellow-500/10 border-yellow-500/30",
    progress: "bg-blue-500/10 border-blue-500/30",
    completed: "bg-green-500/10 border-green-500/30",
    failed: "bg-red-500/10 border-red-500/30",
};

const statusTextColors = {
    started: "text-yellow-400",
    progress: "text-blue-400",
    completed: "text-green-400",
    failed: "text-red-400",
};

const statusBorderColors = {
    started: "border-l-yellow-500",
    progress: "border-l-blue-500",
    completed: "border-l-green-500",
    failed: "border-l-red-500",
};

const AgentProgress = () => {
    const { agentLogs } = useResearchStore();

    const latestAgentStatus = {};
    agentLogs.forEach((log) => {
        latestAgentStatus[log.agentId] = log;
    });

    const agents = Object.values(latestAgentStatus).sort((a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    return (
        <div className="bg-[#1e1e1f] border border-[#2d2d30] rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-white mb-4">Research Progress</h2>

            <div className="space-y-3">
                {agents.length === 0 ? (
                    <p className="text-gray-400 text-sm">⏳ Waiting for agents to start...</p>
                ) : (
                    agents.map((log, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border-l-4 ${statusBgColors[log.status]} border ${statusBorderColors[log.status]} transition-all`}
                        >
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-300">
                                    {agentLabels[log.agentId] || log.agentId}
                                </span>
                                <span className={`text-xs font-semibold ${statusTextColors[log.status]}`}>
                                    {statusIcons[log.status] || log.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {log.message}
                            </p>
                            {log.payload?.durationMs && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {log.payload.durationMs}ms
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AgentProgress;