import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResearch } from '../hooks/useResearch';
import { useResearchStore } from '../store/researchStore';
import AgentProgress from '../components/AgentProgress';
import Report from '../components/Report';
import CitationList from '../components/CitationList';
import KnowledgeGraph from '../components/KnowledgeGraph';

const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { session, report, isLoading, error, isConnected } = useResearch(sessionId);
  const { setSessionId } = useResearchStore();

  useEffect(() => {
    setSessionId(sessionId);
  }, [sessionId, setSessionId]);

  return (
    <div className='min-h-screen w-full bg-[#131314] text-gray-300 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <button 
              onClick={() => navigate('/')} 
              className='text-xs bg-[#2a2a2c] hover:bg-[#323235] text-gray-300 hover:text-white px-3.5 py-1.5 rounded-lg border border-[#3c3c3e] transition-colors cursor-pointer mb-6 flex items-center gap-1.5'
            >
              <span>←</span> Back to Dashboard
            </button>
            <h1 className='text-3xl font-bold capitalize text-white'>
              {session?.topic || 'Research Results'}
            </h1>
            <p className='text-xs text-gray-400 mt-2 flex items-center gap-2'>
              <span className="bg-[#2d2d30] px-2 py-0.5 rounded text-gray-300 border border-[#3c3c3e]">
                {session?.depth && `${session.depth.charAt(0).toUpperCase() + session.depth.slice(1)} Depth`}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                {isConnected ? 'Connected' : 'Reconnecting...'}
              </span>
            </p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
            <p className='text-red-400 text-sm'>{error}</p>
          </div>
        )}

        {/* Main content */}
        {isLoading && !report ? (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left sidebar — Agent progress */}
            <div className='lg:col-span-1'>
              <AgentProgress />
            </div>

            {/* Right side — Status */}
            <div className='lg:col-span-2'>
              <div className='bg-[#1e1e1f] border border-[#2d2d30] rounded-lg p-12 flex flex-col items-center justify-center min-h-[300px]'>
                {session?.status === 'failed' ? (
                  <div className="text-center">
                    <p className="text-2xl mb-2">⚠️</p>
                    <p className='text-red-400 font-medium'>Research run failed</p>
                    <p className='text-xs text-gray-500 mt-1'>Check your agent logs for error details.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className='text-gray-300 font-medium'>Synthesizing research data...</p>
                    <p className='text-xs text-gray-500 mt-1'>Gathering context from sources and generating report.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left sidebar */}
            <div className='lg:col-span-1 space-y-6'>
              <AgentProgress />
              {report?.knowledgeGraph && (
                <KnowledgeGraph graph={report.knowledgeGraph} />
              )}
            </div>

            {/* Main content */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Report */}
              {report ? (
                <>
                  <div className='bg-[#1e1e1f] border border-[#2d2d30] rounded-xl p-8 shadow-xl'>
                    <Report report={report} />
                  </div>
                  {report.citations && report.citations.length > 0 && (
                    <CitationList citations={report.citations} />
                  )}
                </>
              ) : (
                <div className="bg-[#1e1e1f] border border-[#2d2d30] rounded-xl p-8 text-center text-gray-500">
                  No report available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results