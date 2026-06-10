import React, { useState } from 'react'
import { researchAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useResearchStore } from '../store/researchStore'
import logo from "../assets/logo.svg"

const ResearchInput = () => {
    const [topic, setTopic] = useState("");
    const [depth, setDepth] = useState("standard");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showDepthDropdown, setShowDepthDropdown] = useState(false)
    const navigate = useNavigate();
    const { setSessionId, setTopic: setStoreTopic } = useResearchStore();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!topic.trim() || loading) return;
        setLoading(true);
        setError("");

        try {
            const { data } = await researchAPI.createSession(topic, depth)
            setSessionId(data.sessionId)
            setStoreTopic(topic);
            navigate(`/results/${data.sessionId}`);

        } catch (err) {
            console.error("Failed to create research session", err)
            setError(err.response?.data?.message || "Failed to create session");
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const depthLabels = {
        quick: 'Quick',
        standard: 'Standard',
        deep: 'Deep'
    };

    return (
        <div className='w-full min-h-full py-12 flex items-center justify-center p-4 bg-transparent animate-fade-in'>
            <div className='max-w-2xl w-full'>
                <div className='flex items-center justify-center mb-2'>
                    <h1 className='text-4xl font-bold text-white mb-2 tracking-tight font-logo'>Lumen</h1>
                    <img src={logo} alt="" className='w-20 h-20 mb-1' />
                </div>
                <p className='text-gray-400 text-center text-sm mb-8'>AI-Powered Research Co-pilot</p>

                <form 
                    onSubmit={handleSubmit} 
                    className='bg-[#1c1c1e] p-5 pb-4 rounded-[24px] shadow-2xl border border-[#2d2d30] flex flex-col transition-all duration-300 hover:border-[#3c1f6f]'
                >
                    {error && (
                        <div className='mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm'>
                            {error}
                        </div>
                    )}

                    <div className='relative w-full'>
                        <textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className='w-full min-h-[96px] bg-transparent text-white placeholder-gray-500 border-0 focus:ring-0 focus:outline-none resize-none text-base pr-2'
                            placeholder='What would you like to research today?'
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className='flex items-center justify-between mt-3 pt-3 border-t border-[#2d2d30]/40'>
                        {/* Left action area: Depth Dropdown */}
                        <div className='flex items-center gap-2.5'>
                            <div className='relative'>
                                <button
                                    type="button"
                                    onClick={() => setShowDepthDropdown(!showDepthDropdown)}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-[#262629] hover:bg-[#323235] text-xs font-medium text-gray-300 rounded-full border border-[#2d2d30] transition-colors cursor-pointer"
                                >
                                    <span>{depthLabels[depth]} Depth</span>
                                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showDepthDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showDepthDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowDepthDropdown(false)} />
                                        <div className="absolute left-0 bottom-full mb-2 w-36 bg-[#1e1e20] border border-[#2d2d30] rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                                            {['quick', 'standard', 'deep'].map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => {
                                                        setDepth(d);
                                                        setShowDepthDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                                                        depth === d 
                                                        ? 'bg-[#262629] text-white font-semibold' 
                                                        : 'text-gray-400 hover:bg-[#262629] hover:text-white'
                                                    }`}
                                                >
                                                    {depthLabels[d]}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right action area: Pill submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !topic.trim()}
                                className="px-5 py-2 rounded-full bg-black text-white hover:bg-zinc-900 border border-[#2d2d30] font-medium transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <span>{loading ? 'Starting...' : 'Start Research'}</span>
                                {!loading && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                                {loading && (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                <p className='text-center text-gray-500 text-xs mt-6'>
                    Results typically appear in 15-30 seconds
                </p>
            </div>
        </div>
    )
}

export default ResearchInput