import React from 'react'
import { useAuthStore } from '../store/authStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <div className="w-full">
      <header className="w-full bg-[#1e1e1f] border-b border-[#2d2d30] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-linear-to-r from-violet-400 via-purple-200 to-fuchsia-400 bg-clip-text text-transparent font-logo">
            Lumen
          </span>
          <span className="text-xs text-gray-500 border border-[#3c3c3e] px-2 py-0.5 rounded-full">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium text-gray-200 capitalize">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-[#2a2a2c] hover:bg-[#323235] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#3c3c3e] transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>
    </div>
  )
}

export default Navbar