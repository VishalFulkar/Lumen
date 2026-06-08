import ReactMarkdown from "react-markdown";

const Report = ({ report }) => {
    if (!report) return <p className="text-gray-400">No report available</p>;

    return (
        <div className="space-y-6">
            {/* Main report */}
            <div className="prose prose-invert max-w-none text-gray-300">
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => (
                            <h1 className="text-3xl font-bold text-white mt-6 mb-4" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                            <h2 className="text-2xl font-bold text-white mt-4 mb-3" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                            <h3 className="text-xl font-semibold text-white mt-3 mb-2" {...props} />
                        ),
                        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        ul: ({ node, ...props }) => (
                            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
                        ),
                        li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                        code: ({ node, inline, ...props }) =>
                            inline ? (
                                <code
                                    className="bg-[#2a2a2a] px-2 py-1 rounded text-sm font-mono text-blue-400"
                                    {...props}
                                />
                            ) : (
                                <pre className="bg-[#2a2a2a] p-4 rounded-lg overflow-auto mb-4 border border-[#333]">
                                    <code className="font-mono text-sm text-gray-300" {...props} />
                                </pre>
                            ),
                        blockquote: ({ node, ...props }) => (
                            <blockquote
                                className="border-l-4 border-blue-500 pl-4 py-2 italic text-gray-400 mb-4"
                                {...props}
                            />
                        ),
                    }}
                >
                    {report.markdown}
                </ReactMarkdown>
            </div>

            {/* Stats */}
            {report.wordCount && (
                <div className="pt-4 border-t border-[#333]">
                    <p className="text-xs text-gray-500">
                        📊 {report.wordCount} words • {Math.ceil(report.wordCount / 200)} min read
                    </p>
                </div>
            )}
        </div>
    );
}

export default Report;
