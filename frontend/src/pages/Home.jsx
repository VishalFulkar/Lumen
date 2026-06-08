import React, { useEffect, useState } from 'react'
import ResearchInput from '../components/ResearchInput'
import { useResearchStore } from '../store/researchStore'
import { researchAPI } from '../services/api'
import SessionHistory from '../components/SessionHistory'
import Navbar from '../components/Navbar'

const Home = () => {
  const { sessions, setSessions } = useResearchStore()
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await researchAPI.getSessions();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      }
    };
    fetchSessions();
  }, [setSessions]);

  return (
    <div className='min-w-screen h-screen bg-[#131314] text-white flex flex-col overflow-hidden'>
      {/* Header */}
      <Navbar />
      {/* Main Body Layout with Sidebar */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className={`border-r border-[#2d2d30] bg-[#1c1c1e] flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${showSidebar ? 'w-72' : 'w-0 border-r-0'}`}>
          <div className="w-72 flex flex-col h-full">
            <div className="p-4 border-b border-[#2d2d30] flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Research History</span>
              <span className="text-[10px] text-gray-400 bg-[#2d2d30] px-2.5 py-0.5 rounded-full font-medium">{sessions.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <SessionHistory sessions={sessions} />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#131314] relative">
          {/* Floating Sidebar Toggle Button */}
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute top-6 left-6 p-2 bg-[#1c1c1e] hover:bg-[#2a2a2c] text-gray-400 hover:text-white rounded-lg border border-[#2d2d30] shadow-md transition-all z-40 cursor-pointer flex items-center justify-center"
            title={showSidebar ? "Hide Research History" : "Show Research History"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm5 0v14" />
            </svg>
          </button>

          <div className="flex-1 flex items-center justify-center p-6 min-h-0">
            <ResearchInput />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home