
const CitationList = ({ citations }) => {
    if (!citations || citations.length === 0) {
        return null;
    }

    // Deduplicate citations by index to prevent duplicate UI entries and key warnings
    const uniqueCitations = [];
    const seen = new Set();
    for (const c of citations) {
        if (!seen.has(c.index)) {
            seen.add(c.index);
            uniqueCitations.push(c);
        }
    }

    // Sort citations numerically for professional reference styling
    uniqueCitations.sort((a, b) => a.index - b.index);

    return (
        <div className="bg-[#1e1e1f] border border-[#2d2d30] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">References ({uniqueCitations.length})</h3>

            <div className="space-y-2">
                {uniqueCitations.map((citation) => (
                    <a
                        key={citation.index}
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-[#2a2a2c] border border-[#3c3c3e] rounded-lg hover:scale-105 transition-all group"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-blue-400 font-semibold text-sm shrink-0">
                                [{citation.index}]
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-300 group-hover:text-white truncate">
                                    {citation.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-1">
                                    {citation.url}
                                </p>
                                {!citation.valid && (
                                    <p className="text-xs text-yellow-400 mt-1">⚠️ Citation not verified</p>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default CitationList;